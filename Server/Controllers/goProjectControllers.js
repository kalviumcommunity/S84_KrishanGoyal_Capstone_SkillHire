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

const getAllGoProjects = async (req, res) => {
  try {
    const projects = await GoProject.find()
      .populate('postedBy', 'fullName email')
      .populate('assignedTo', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({ projects });
  } catch (error) {
    console.error('Error fetching GoProjects:', error);
    res.status(500).json({ error: 'Server error while fetching projects' });
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



module.exports = { createGoProject, getAllGoProjects, updateGoProject, deleteGoProject };