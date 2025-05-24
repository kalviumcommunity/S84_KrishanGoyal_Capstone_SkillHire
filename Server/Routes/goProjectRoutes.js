const express = require('express')
const router = express.Router()
const {createGoProject, getAllGoProjects, updateGoProject, deleteGoProject, getGoProjectsByUser}  = require('../Controllers/goProjectControllers')
const verifyToken = require('../Middlewares/authMiddleware')

router.get('/get', verifyToken, getAllGoProjects)
router.post('/add', verifyToken, createGoProject)
router.put('/:id', verifyToken, updateGoProject)
router.delete('/:id', verifyToken, deleteGoProject)
router.get('/:id', verifyToken, getGoProjectsByUser)

module.exports = router