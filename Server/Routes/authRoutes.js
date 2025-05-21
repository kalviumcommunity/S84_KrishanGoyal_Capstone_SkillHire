const express = require('express');
const router = express.Router();
const { signup, completeProfile, login, getMe, googleAuth } = require('../Controllers/authControllers');
const verifyToken = require('../Middlewares/authMiddleware');

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/google-auth', googleAuth);

// Protected routes
router.post('/complete-profile', verifyToken, completeProfile);
router.get('/me', verifyToken, getMe);

module.exports = router;