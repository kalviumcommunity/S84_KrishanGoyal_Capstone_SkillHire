const express = require('express');
const router = express.Router();
const {
  createPayment,
  verifyPayment,
  getPaymentDetails,
} = require('../Controllers/paymentController');
const verifyToken = require('../Middlewares/authMiddleware');

// Create a payment for a project
router.post('/:projectType/:projectId', verifyToken, createPayment);

// Verify payment after Razorpay callback
router.post('/verify', verifyToken, verifyPayment);

// Get payment details
router.get('/:paymentId', verifyToken, getPaymentDetails);

module.exports = router;