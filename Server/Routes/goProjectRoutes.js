const express = require('express')
const router = express.Router()
const {createGoProject, updateGoProject, deleteGoProject, getGoProjectsByUser, getGoProject}  = require('../Controllers/goProjectControllers')
const verifyToken = require('../Middlewares/authMiddleware')

router.post('/add', verifyToken, createGoProject)
router.put('/:id', verifyToken, updateGoProject)
router.delete('/:id', verifyToken, deleteGoProject)
router.get('/:id', verifyToken, getGoProjectsByUser)
router.get('/go-projects/:projectId', getGoProject);

module.exports = router