const express = require('express')
const router = express.Router()
const {createProProject, updateProProject, deleteProProject, getMyProProjects, getProProject, getAssignedProProjects, getProEarnings, getAllAvailableProProjects, applyToProProject, getAppliedProjects, assignProProject}  = require('../Controllers/proProjectControllers')
const verifyToken = require('../Middlewares/authMiddleware')

router.post('/add', verifyToken, createProProject)
router.get('/all', verifyToken, getAllAvailableProProjects)
router.get('/assigned', verifyToken, getAssignedProProjects)
router.get('/earnings', verifyToken, getProEarnings)
router.get('/applied', verifyToken, getAppliedProjects)
router.get('/:projectId', getProProject);
router.get('/my/:id', verifyToken, getMyProProjects)
router.put('/:id', verifyToken, updateProProject)
router.delete('/:id', verifyToken, deleteProProject)
router.post('/:projectId/apply', verifyToken, applyToProProject)
router.post('/:projectId/assign', verifyToken, assignProProject)

module.exports = router