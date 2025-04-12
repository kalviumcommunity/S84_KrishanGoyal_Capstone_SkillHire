const Project = require('../Models/projectModel')

const getProjects = async(req,res)=>{
    try {
        const projects = await Project.find()
        res.status(200).json({
            success: true,
            Projects: projects
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong while fetching project data'
        })
    }
}

const postProjects = async (req, res) => {
    try {
      const { title, category, description, dueDate, postedBy } = req.body;
  
      const newProject = new Project({
        title,
        category,
        description,
        dueDate,
        postedBy
      });

      await newProject.save()
  
      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: newProject
      });


    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map((err) => ({
          message: `${err.message}`
        }));
  
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors
        });
      }
  
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Something went wrong while creating the project'
      });
    }
  };

module.exports = {getProjects, postProjects}