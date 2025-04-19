const Project = require('../Models/projectModel')

const getProjects = async(req,res)=>{
    try {
        const projects = await Project.find()

        if(projects.length === 0){
            return res.json({
                message: "No project data present"
            })
        }
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

module.exports = {getProjects}