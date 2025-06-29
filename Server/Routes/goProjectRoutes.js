const express = require('express')
const router = express.Router()
const { 
  createGoProject, updateGoProject, deleteGoProject, 
  getGoProjectsByUser, getGoProject, acceptGoProject, 
  getGoProjectsByAssignedWorker, getAvailableGoProjects, 
  getActiveGoProjects, markGoProjectAsComplete, 
  confirmGoProjectCompletion, getGoWorkerCompletedTasks,
  setGoProjectPayment
} = require('../Controllers/goProjectControllers')
const verifyToken = require('../Middlewares/authMiddleware')

// POST routes
router.post('/add', verifyToken, createGoProject)
router.post('/:id/accept', verifyToken, acceptGoProject);

// PUT/DELETE routes
router.put('/:id', verifyToken, updateGoProject)
router.delete('/:id', verifyToken, deleteGoProject)
router.put('/:id/mark-complete', verifyToken, markGoProjectAsComplete);
router.put('/:id/confirm-completion', verifyToken, confirmGoProjectCompletion);
router.put('/:id/set-payment', verifyToken, setGoProjectPayment);


// GET routes with specific paths (these must come BEFORE routes with params)
router.get('/available', verifyToken, getAvailableGoProjects);
router.get('/assigned/:workerId', verifyToken, getGoProjectsByAssignedWorker);
router.get('/active/:workerId', verifyToken, getActiveGoProjects);
router.get('/completed/:userId', verifyToken, getGoWorkerCompletedTasks);
router.get('/user/:userId', verifyToken, getGoProjectsByUser); // <-- for all projects by user
router.get('/:projectId', verifyToken, getGoProject);

module.exports = router