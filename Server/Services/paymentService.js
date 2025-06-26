const crypto = require('crypto');
const Razorpay = require('razorpay');
const Payment = require('../Models/paymentModel');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a new payment order
async function createPaymentOrder(amount, currency = 'INR', receipt, notes = {}) {
  try {
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt,
      notes,
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
}

// Verify payment signature
function verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  return generatedSignature === razorpaySignature;
}

// Create a new payment record in the database
async function createPaymentRecord(data) {
  try {
    console.log('Creating payment record with data:', data);
    const payment = new Payment(data);
    await payment.save();
    console.log('Payment record created:', payment);
    return payment;
  } catch (error) {
    console.error('Error creating payment record:', error);
    throw error;
  }
}

// Update a payment record after successful payment
async function updatePaymentRecord(paymentId, updateData) {
  try {
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { $set: updateData },
      { new: true }
    );
    return payment;
  } catch (error) {
    console.error('Error updating payment record:', error);
    throw error;
  }
}

module.exports = {
  createPaymentOrder,
  verifyPaymentSignature,
  createPaymentRecord,
  updatePaymentRecord,
};