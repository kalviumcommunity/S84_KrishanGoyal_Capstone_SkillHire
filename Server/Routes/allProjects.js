const express = require('express');
const router = express.Router();
const { getAllProjects, getAllProjectsByUser } = require('../Controllers/getAllProjects');
const verifyToken = require('../Middlewares/authMiddleware');

router.get('/all', verifyToken, getAllProjects);
router.get('/posted/:userId', verifyToken, getAllProjectsByUser);

module.exports = router;