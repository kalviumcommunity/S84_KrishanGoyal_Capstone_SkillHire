const GoProject = require('../Models/goProjectModel');


const createGoProject = async (req, res) => {
  try {
    const { title, description, city, subCity, category } = req.body;

    if (req.user.role !== 'client') {
      return res.status(403).json({ error: 'Only clients can create a GoProject' });
    }

    const missingFields = [];
    if (!title) missingFields.push('title');
    if (!description) missingFields.push('description');
    if (!city) missingFields.push('city');
    if (!category) missingFields.push('category');

    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Missing required field(s): ${missingFields.join(', ')}` });
    }

    const newProject = new GoProject({
      title,
      description,
      city,
      subCity,
      category,
      postedBy: req.user._id,
    });

    await newProject.save();

    res.status(201).json({
      message: 'GoProject created successfully',
      project: newProject
    });
  } catch (error) {
    console.error('Error creating GoProject:', error);
    res.status(500).json({ error: 'Server error while creating project' });
  }
};

const updateGoProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const project = await GoProject.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'GoProject not found' });
    }

    if (req.user._id.toString() !== project.postedBy.toString()) {
      return res.status(403).json({ error: 'You are not authorized to update this project' });
    }

    if (project.status !== "yet to be assigned") {
      return res.status(400).json({ error: "Cannot edit a project that is already assigned or completed" });
    }

    const updatedProject = await GoProject.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({
      message: 'GoProject updated successfully',
      project: updatedProject,
    });
  } catch (error) {
    console.error('Error updating GoProject:', error);
    res.status(500).json({ error: 'Server error while updating project' });
  }
};


const deleteGoProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await GoProject.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'GoProject not found' });
    }

    if (req.user._id.toString() !== project.postedBy.toString()) {
      return res.status(403).json({ error: 'You are not authorized to delete this project' });
    }

    await GoProject.findByIdAndDelete(id);

    res.status(200).json({ message: 'GoProject deleted successfully' });
  } catch (error) {
    console.error('Error deleting GoProject:', error);
    res.status(500).json({ error: 'Server error while deleting project' });
  }
};

const getGoProjectsByUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const userProjects = await GoProject.find({ postedBy: userId })
      .populate('postedBy', 'fullName email')
      .populate('assignedTo', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({ projects: userProjects });
  } catch (error) {
    console.error('Error fetching user projects:', error);
    res.status(500).json({ error: 'Server error while fetching user projects' });
  }
};

const getGoProject = async (req, res) => {
  try {
    const project = await GoProject.findById(req.params.projectId)
      .populate('postedBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!project) {
      return res.status(404).json({ error: 'GO Project not found' });
    }

    res.json({ project });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching GO project' });
  }
};

const acceptGoProject = async (req, res) => {
  try {
    const { id: jobId } = req.params;
    const userId = req.user._id;
    
    const project = await GoProject.findById(jobId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    
    if (project.status !== "yet to be assigned") {
      return res.status(400).json({ error: "Project is already assigned" });
    }
    
    // Assign the project to the current user
    project.assignedTo = userId;
    project.status = "assigned but not completed";
    await project.save();
    
    // Return populated project for better frontend display
    const populatedProject = await GoProject.findById(jobId)
      .populate('assignedTo', 'fullName email')
      .populate('postedBy', 'fullName email');
    
    res.status(200).json({ 
      message: "Project accepted successfully",
      project: populatedProject
    });
  } catch (error) {
    console.error('Error accepting project:', error);
    res.status(500).json({ error: 'Server error accepting project' });
  }
};

const getGoProjectsByAssignedWorker = async (req, res) => {
  try {
    const workerId = req.params.workerId;

    const assignedProjects = await GoProject.find({ 
      assignedTo: workerId 
    })
      .populate('postedBy', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({ projects: assignedProjects });
  } catch (error) {
    console.error('Error fetching assigned projects:', error);
    res.status(500).json({ error: 'Server error fetching assigned projects' });
  }
};

// Add these functions to your existing controller file

// Get all available (non-assigned) GO projects
const getAvailableGoProjects = async (req, res) => {
  try {
    let query = { 
      status: "yet to be assigned" 
    };
    
    // Apply filters if provided
    if (req.query.location) {
      query.$or = [
        { city: { $regex: req.query.location, $options: 'i' } },
        { subCity: { $regex: req.query.location, $options: 'i' } }
      ];
    }
    
    if (req.query.category) {
      query.category = { $regex: req.query.category, $options: 'i' };
    }
    
    const availableProjects = await GoProject.find(query)
      .populate('postedBy', 'fullName email')
      .sort({ createdAt: -1 });
      
    res.status(200).json({ projects: availableProjects });
  } catch (error) {
    console.error('Error fetching available projects:', error);
    res.status(500).json({ error: 'Server error fetching available projects' });
  }
};

// Get active projects for a specific worker
const getActiveGoProjects = async (req, res) => {
  try {
    const workerId = req.params.workerId;
    
    const activeProjects = await GoProject.find({ 
      assignedTo: workerId,
      status: "assigned but not completed"
    })
      .populate('postedBy', 'fullName email')
      .sort({ updatedAt: -1 });
      
    res.status(200).json({ projects: activeProjects });
  } catch (error) {
    console.error('Error fetching active projects:', error);
    res.status(500).json({ error: 'Server error fetching active projects' });
  }
};

const markGoProjectAsComplete = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const project = await GoProject.findById(id);
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

const confirmGoProjectCompletion = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const project = await GoProject.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    if (project.postedBy.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Only the assigning client can confirm completion" });
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

const getGoWorkerCompletedTasks = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Verify the user is requesting their own projects
    if (userId !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized access" });
    }
    
    // Find all projects assigned to this user that are either pending confirmation or completed
    const projects = await GoProject.find({
      assignedTo: userId,
      status: { $in: ['pending confirmation', 'completed'] }
    })
    .populate('postedBy', 'fullName email')
    .sort('-updatedAt');
    
    res.status(200).json({ projects });
  } catch (error) {
    console.error('Error fetching completed tasks:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { 
  createGoProject, 
  updateGoProject, 
  deleteGoProject, 
  getGoProjectsByUser, 
  getGoProject, 
  acceptGoProject, 
  getGoProjectsByAssignedWorker, 
  getAvailableGoProjects, 
  getActiveGoProjects, 
  markGoProjectAsComplete, 
  confirmGoProjectCompletion, 
  getGoWorkerCompletedTasks };