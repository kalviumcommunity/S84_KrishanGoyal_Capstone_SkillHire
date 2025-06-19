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



module.exports = { createGoProject, updateGoProject, deleteGoProject, getGoProjectsByUser, getGoProject };