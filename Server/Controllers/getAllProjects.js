const GoProject = require('../Models/goProjectModel');
const ProProject = require('../Models/proProjectModel');

const getAllProjects = async (req, res) => {
  try {
    const goProjects = await GoProject.find();
    const proProjects = await ProProject.find();
    const projects = [...goProjects, ...proProjects];
    res.status(200).json({ projects });
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching all projects' });
  }
};

const getAllProjectsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const goProjects = await GoProject.find({ postedBy: userId });
    const proProjects = await ProProject.find({ postedBy: userId });
    const projects = [...goProjects, ...proProjects];
    res.status(200).json({ projects });
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching user projects' });
  }
};

// Add these new functions to getAllProjects.js
const getPendingConfirmationProjects = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Verify the user is requesting their own projects
    if (userId !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized access" });
    }
    
    // Get GO projects that need confirmation
    const goProjects = await GoProject.find({
      postedBy: userId,
      status: 'pending confirmation'
    })
    .populate('assignedTo', 'fullName email')
    .sort('-updatedAt');
    
    // Add type field to each project for frontend identification
    const goProjectsWithType = goProjects.map(project => {
      const projectObj = project.toObject();
      projectObj.type = 'go';
      return projectObj;
    });
    
    // Get PRO projects that need confirmation
    const proProjects = await ProProject.find({
      postedBy: userId,
      status: 'pending confirmation'
    })
    .populate('assignedTo', 'fullName email')
    .sort('-updatedAt');
    
    // Add type field to each project
    const proProjectsWithType = proProjects.map(project => {
      const projectObj = project.toObject();
      projectObj.type = 'pro';
      return projectObj;
    });
    
    // Combine and return all projects
    const projects = [...goProjectsWithType, ...proProjectsWithType];
    
    res.status(200).json({ projects });
  } catch (error) {
    console.error('Error fetching pending confirmation projects:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getCompletedProjects = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Verify the user is requesting their own projects
    if (userId !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized access" });
    }
    
    // Get GO completed projects
    const goProjects = await GoProject.find({
      postedBy: userId,
      status: 'completed'
    })
    .populate('assignedTo', 'fullName email')
    .sort('-updatedAt');
    
    // Add type field to each project
    const goProjectsWithType = goProjects.map(project => {
      const projectObj = project.toObject();
      projectObj.type = 'go';
      return projectObj;
    });
    
    // Get PRO completed projects
    const proProjects = await ProProject.find({
      postedBy: userId,
      status: 'completed'
    })
    .populate('assignedTo', 'fullName email')
    .sort('-updatedAt');
    
    // Add type field to each project
    const proProjectsWithType = proProjects.map(project => {
      const projectObj = project.toObject();
      projectObj.type = 'pro';
      return projectObj;
    });
    
    // Combine and return all projects
    const projects = [...goProjectsWithType, ...proProjectsWithType];
    
    res.status(200).json({ projects });
  } catch (error) {
    console.error('Error fetching completed projects:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update module.exports to include new functions
module.exports = {
  getAllProjects,
  getAllProjectsByUser,
  getPendingConfirmationProjects,
  getCompletedProjects
};