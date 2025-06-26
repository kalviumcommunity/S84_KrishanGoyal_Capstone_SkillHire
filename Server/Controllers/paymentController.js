const GoProject = require('../Models/goProjectModel');
const ProProject = require('../Models/proProjectModel');
const User = require('../Models/userModel');
const Payment = require('../Models/paymentModel');
const Chat = require('../Models/chatModel');
const paymentService = require('../Services/paymentService');

// Create a payment order for a project
const createPayment = async (req, res) => {
  try {
    const { projectId, projectType } = req.params;
    const userId = req.user._id;

    // Get the correct project model based on type
    const ProjectModel = projectType === 'go' ? GoProject : ProProject;
    
    // Find the project
    const project = await ProjectModel.findById(projectId)
      .populate('postedBy', 'fullName email')
      .populate('assignedTo', 'fullName email');
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Check if user is the client who posted the project
    if (project.postedBy._id.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Only the client can make payments' });
    }
    
    // Check if project is in pending confirmation status
    if (project.status !== 'pending confirmation') {
      return res.status(400).json({ error: 'Project is not ready for payment' });
    }
    
    // Get the payment amount based on project type
    const amount = projectType === 'go' ? project.payment : project.budget;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid payment amount' });
    }
    
    // Create a new Razorpay order
    const order = await paymentService.createPaymentOrder(
      amount,
      'INR',
      `payment_for_${projectType}_${projectId}`,
      {
        projectId,
        projectType,
        clientId: userId.toString(),
        workerId: project.assignedTo._id.toString(),
      }
    );
    
    // Create a payment record in the database
    const payment = await paymentService.createPaymentRecord({
      projectId: project._id,
      projectType: projectType === 'go' ? 'GoProject' : 'ProProject',
      client: userId,
      worker: project.assignedTo._id,
      amount,
      razorpayOrderId: order.id,
      status: 'created'
    });
    
    // Return the order details for the frontend
    res.status(200).json({
      order,
      payment: {
        id: payment._id,
        amount,
      },
      key: process.env.RAZORPAY_KEY_ID,
      project: {
        id: project._id,
        title: project.title,
      },
      client: {
        name: project.postedBy.fullName,
        email: project.postedBy.email,
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment' });
  }
};

// Verify and complete payment
const verifyPayment = async (req, res) => {
  try {
    const { paymentId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
    
    // Verify the payment signature
    const isSignatureValid = paymentService.verifyPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );
    
    if (!isSignatureValid) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }
    
    // Get the payment record
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found' });
    }
    
    // Update the payment record
    const updatedPayment = await paymentService.updatePaymentRecord(paymentId, {
      razorpayPaymentId,
      status: 'completed',
      paymentDetails: req.body
    });
    
    // Get the project model and update the project status
    const ProjectModel = payment.projectType === 'GoProject' ? GoProject : ProProject;
    const project = await ProjectModel.findById(payment.projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Mark the project as completed
    project.status = 'completed';
    project.completedAt = new Date(); // Add completion timestamp
    project.paidAt = new Date();
    await project.save();
    
    // Find the chat and send a system message about payment
    const chat = await Chat.findOne({
      projectId: payment.projectId,
      projectType: payment.projectType,
      client: payment.client,
      worker: payment.worker
    });

    if (chat) {
      // Create a system message about payment
      const message = {
        chatId: chat._id,
        sender: payment.client,
        content: `Payment of ₹${payment.amount} completed successfully. Project marked as completed.`,
        isSystemMessage: true
      };
      
      // Save the message if you have the message service
      // await messageService.createMessage(message);
    }
    
    res.status(200).json({
      success: true,
      message: 'Payment verified and project marked as completed',
      payment: updatedPayment,
      projectId: project._id,
      projectType: payment.projectType === 'GoProject' ? 'go' : 'pro'
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};

// Get payment details
const getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await Payment.findById(paymentId)
      .populate('projectId')
      .populate('client', 'fullName email')
      .populate('worker', 'fullName email');
      
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    // Check if user is client or worker
    if (
      payment.client._id.toString() !== req.user._id.toString() &&
      payment.worker._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }
    
    res.status(200).json({ payment });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment details' });
  }
};

module.exports = {
  createPayment,
  verifyPayment,
  getPaymentDetails,
};