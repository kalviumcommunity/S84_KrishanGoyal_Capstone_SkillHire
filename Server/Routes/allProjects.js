const express = require('express');
const router = express.Router();
const { getAllProjects, getAllProjectsByUser, getPendingConfirmationProjects, getCompletedProjects } = require('../Controllers/getAllProjects');
const verifyToken = require('../Middlewares/authMiddleware');

// Existing routes
router.get('/all', verifyToken, getAllProjects);
router.get('/posted/:userId', verifyToken, getAllProjectsByUser);

// New routes for pending confirmation and completed projects
router.get('/pending-confirmation/:userId', verifyToken, getPendingConfirmationProjects);
router.get('/completed/:userId', verifyToken, getCompletedProjects);

module.exports = router;