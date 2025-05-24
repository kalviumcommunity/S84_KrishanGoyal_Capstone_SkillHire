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
    console.error('Error creating ProProject:', error);
    res.status(500).json({ error: 'Server error while creating project' });
  }
};

const getProProjects = async (req, res) => {
  try {
    const { postedBy } = req.query;

    const filter = {};
    if (postedBy) {
      filter.postedBy = postedBy;
    }

    const projects = await ProProject.find(filter)
      .populate('postedBy', 'fullName email')
      .populate('assignedTo', 'fullName email');
    res.status(200).json({
      message: 'ProProjects fetched successfully',
      count: projects.length,
      projects
    });
  } catch (error) {
    console.error('Error fetching ProProjects:', error);
    res.status(500).json({ error: 'Server error while fetching projects' });
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

    const updatedProject = await ProProject.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({
      message: 'ProProject updated successfully',
      project: updatedProject
    });
  } catch (error) {
    console.error('Error updating ProProject:', error);
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
    console.error('Error deleting ProProject:', error);
    res.status(500).json({ error: 'Server error while deleting project' });
  }
};

const getMyProProjects = async (req, res) => {
  try {
    const userId = req.user._id;

    const projects = await ProProject.find({ postedBy: userId })
      .populate('postedBy', 'fullName email')
      .populate('assignedTo', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'ProProjects created by current user fetched successfully',
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error('Error fetching user ProProjects:', error);
    res.status(500).json({ error: 'Server error while fetching user projects' });
  }
};

module.exports = { createProProject, getProProjects, updateProProject, deleteProProject, getMyProProjects };