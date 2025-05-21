const express = require('express')
const router = express.Router()
const {createGoProject, getAllGoProjects, updateGoProject, deleteGoProject}  = require('../Controllers/goProjectControllers')
const verifyToken = require('../Middlewares/authMiddleware')

router.get('/get', verifyToken, getAllGoProjects)
router.post('/add', verifyToken, createGoProject)
router.put('/:id', verifyToken, updateGoProject)
router.delete('/:id', verifyToken, deleteGoProject)

module.exports = router