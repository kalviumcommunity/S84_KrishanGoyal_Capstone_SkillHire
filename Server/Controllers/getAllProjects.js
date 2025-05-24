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

module.exports = { getAllProjects, getAllProjectsByUser };