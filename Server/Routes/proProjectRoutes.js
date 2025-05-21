const express = require('express')
const router = express.Router()
const {createProProject, getProProjects, updateProProject, deleteProProject}  = require('../Controllers/proProjectControllers')
const verifyToken = require('../Middlewares/authMiddleware')

router.post('/add', verifyToken, createProProject)
router.get('/get', verifyToken, getProProjects)
router.put('/:id', verifyToken, updateProProject)
router.delete('/:id', verifyToken, deleteProProject)

module.exports = router