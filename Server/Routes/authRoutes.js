const express = require('express');
const { signup, login, getMe, completeProfile, googleAuth } = require('../Controllers/authControllers');
const verifyToken = require('../Middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/google-auth', googleAuth)

// Protected routes
router.get('/me', verifyToken, getMe);
router.post('/complete-profile', verifyToken, completeProfile);

module.exports = router;
