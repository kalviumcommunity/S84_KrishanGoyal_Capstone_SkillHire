const express = require('express')
const router = express.Router()
const {createProProject, updateProProject, deleteProProject, getMyProProjects, getProProject}  = require('../Controllers/proProjectControllers')
const verifyToken = require('../Middlewares/authMiddleware')

router.post('/add', verifyToken, createProProject)
router.put('/:id', verifyToken, updateProProject)
router.delete('/:id', verifyToken, deleteProProject)
router.get('/:id', verifyToken, getMyProProjects)
router.get('/pro-projects/:projectId', getProProject);

module.exports = router