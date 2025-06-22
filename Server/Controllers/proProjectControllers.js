const ProProject = require('../Models/proProjectModel');
const User = require('../Models/userModel');

const createProProject = async (req, res) => {
  try {
    const { title, description, dueDate, budget } = req.body;


    if (req.user.role !== 'client') {
      return res.status(403).json({ error: 'Only clients can post projects' });
    }

    const missingFields = [];
    if (!title) missingFields.push('title');
    if (!description) missingFields.push('description');
    if (!budget) missingFields.push('budget');

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required field(s): ${missingFields.join(', ')}`
      });
    }

    const newProject = new ProProject({
      title,
      description,
      dueDate,
      budget,
      postedBy: req.user._id
    });

    await newProject.save();

    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { postedJobs: newProject._id } }
    );

    res.status(201).json({
      message: 'ProProject created successfully',
      project: newProject
    });

  } catch (error) {
    res.status(500).json({ error: 'Server error while creating project' });
  }
};

const updateProProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const project = await ProProject.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'ProProject not found' });
    }

    if (req.user._id.toString() !== project.postedBy.toString()) {
      return res.status(403).json({ error: 'You are not authorized to update this project' });
    }

    if (project.status !== "yet to be assigned") {
      return res.status(400).json({ error: "Cannot edit a project that is already assigned or completed" });
    }

    const updatedProject = await ProProject.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({
      message: 'ProProject updated successfully',
      project: updatedProject
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error while updating project' });
  }
};

const deleteProProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await ProProject.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'ProProject not found' });
    }

    if (req.user._id.toString() !== project.postedBy.toString()) {
      return res.status(403).json({ error: 'You are not authorized to delete this project' });
    }

    await ProProject.findByIdAndDelete(id);

    res.status(200).json({ message: 'ProProject deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error while deleting project' });
  }
};

const getMyProProjects = async (req, res) => {
  try {
    const userId = req.user._id;

    const projects = await ProProject.find({ postedBy: userId })
      .populate('postedBy', 'fullName email')
      .populate('assignedTo', 'fullName email')
      .populate('applicants.user', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'ProProjects created by current user fetched successfully',
      count: projects.length,
      projects,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching user projects' });
  }
};

const getProProject = async (req, res) => {
  try {
    const project = await ProProject.findById(req.params.projectId)
      .populate('postedBy', 'fullName email')
      .populate('assignedTo', 'fullName email')
      .populate('applicants.user', 'fullName email');

    if (!project) {
      return res.status(404).json({ error: 'PRO Project not found' });
    }

    res.json({ project });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching PRO project' });
  }
};

const getAssignedProProjects = async (req, res) => {
  try {
    const userId = req.user._id;
    const projects = await ProProject.find({ assignedTo: userId })
      .populate('postedBy', 'fullName email')
      .populate('assignedTo', 'fullName email')
      .sort({ createdAt: -1 });
    res.status(200).json({ projects });
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching assigned projects' });
  }
};

const getProEarnings = async (req, res) => {
  try {
    const userId = req.user._id;
    const completedProjects = await ProProject.find({ assignedTo: userId, status: 'completed' });
    const total = completedProjects.reduce((sum, p) => sum + (p.budget || 0), 0);

    const pendingProjects = await ProProject.find({ assignedTo: userId, status: 'assigned but not completed' });
    const pending = pendingProjects.reduce((sum, p) => sum + (p.budget || 0), 0);

    const recentTransactions = completedProjects
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5)
      .map(p => ({
        title: p.title,
        amount: p.budget,
        date: p.updatedAt,
      }));

    res.json({
      earnings: {
        total,
        pending,
        completed: completedProjects.length,
      },
      transactions: recentTransactions,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching earnings' });
  }
};

const getAllAvailableProProjects = async (req, res) => {
  try {
    const projects = await ProProject.find({ assignedTo: null });
    res.json({ projects });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const applyToProProject = async (req, res) => {
  try {
    if (!req.user) {
      console.error('No user found in request');
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Check if user is a professional
    if (req.user.role !== 'pro-worker') {
      return res.status(403).json({ error: 'Only professional workers can apply to projects' });
    }

    const { pitch } = req.body;
    if (!pitch) {
      return res.status(400).json({ error: 'Pitch is required' });
    }

    // Validate project ID
    if (!req.params.projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    const project = await ProProject.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.assignedTo) {
      return res.status(400).json({ error: 'Project is already assigned' });
    }

    if (!project.applicants) {
      project.applicants = [];
    }

    const hasApplied = project.applicants.some(a =>
      a.user && a.user.toString() === req.user._id.toString()
    );

    if (hasApplied) {
      return res.status(400).json({ error: 'You have already applied to this project' });
    }

    project.applicants.push({ user: req.user._id, pitch });

    try {
      await project.save({ validateBeforeSave: false });
    } catch (saveError) {
      throw saveError;
    }

    res.status(200).json({
      message: 'Application submitted successfully',
      project
    });
  } catch (err) {
    console.error('Error in applyToProProject:', {
      error: err.message,
      stack: err.stack,
      projectId: req.params.projectId,
      userId: req.user?._id,
      body: req.body,
      mongooseError: err.name === 'ValidationError' ? err.errors : undefined,
      name: err.name,
      code: err.code
    });

    const errorResponse = {
      error: 'Failed to submit application. Please try again.',
      details: process.env.NODE_ENV === 'development' ? {
        message: err.message,
        name: err.name,
        code: err.code
      } : undefined
    };

    res.status(500).json(errorResponse);
  }
};

const getAppliedProjects = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized: user not found" });
    }
    const userId = req.user._id;

    const projects = await ProProject.find({ "applicants.user": userId })
      .populate('postedBy', 'fullName email')
      .populate('applicants.user', 'fullName email');

    res.json({ projects });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch applied projects" });
  }
};

const assignProProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.body;

    const project = await ProProject.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (project.status !== "yet to be assigned") {
      return res.status(400).json({ error: "Project already assigned" });
    }

    project.assignedTo = userId;
    project.status = "assigned but not completed";
    await project.save();

    res.json({ message: "Project assigned successfully", project });
  } catch (err) {
    console.error("Assign error:", err);
    res.status(500).json({ error: "Failed to assign project" });
  }
};

const markProProjectAsComplete = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const project = await ProProject.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    if (!project.assignedTo || project.assignedTo.toString() !== userId.toString()) {
      return res.status(403).json({ error: "You are not assigned to this project" });
    }
    if (project.status !== "assigned but not completed" && project.status !== "in-progress") {
      return res.status(400).json({ error: "Project cannot be marked as complete in its current status" });
    }

    project.status = "pending confirmation";
    await project.save();

    res.status(200).json({ message: "Marked as complete, waiting for client confirmation", project });
  } catch (error) {
    console.error("Error marking as complete:", error);
    res.status(500).json({ error: "Server error marking as complete" });
  }
};

const confirmProProjectCompletion = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const project = await ProProject.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    if (project.postedBy.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Only the client who posted this project can confirm completion" });
    }
    if (project.status !== "pending confirmation") {
      return res.status(400).json({ error: "Project is not pending confirmation" });
    }

    project.status = "completed";
    project.completedAt = new Date();
    await project.save();

    res.status(200).json({ message: "Project marked as completed", project });
  } catch (error) {
    console.error("Error confirming completion:", error);
    res.status(500).json({ error: "Server error confirming completion" });
  }
};

module.exports = { createProProject, updateProProject, deleteProProject, getMyProProjects, getProProject, getAssignedProProjects, getProEarnings, getAllAvailableProProjects, applyToProProject, getAppliedProjects, assignProProject, markProProjectAsComplete, confirmProProjectCompletion };