const { Schema, model } = require('mongoose');
const moment = require('moment-timezone');

const paymentSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'projectType'
  },
  projectType: {
    type: String,
    required: true,
    enum: ['GoProject', 'ProProject']
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  worker: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  razorpayOrderId: {
    type: String
  },
  razorpayPaymentId: {
    type: String
  },
  status: {
    type: String,
    enum: ['created', 'pending', 'completed', 'failed'],
    default: 'created'
  },
  paymentDetails: {
    type: Object
  }
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.createdAt = moment(ret.createdAt).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
      ret.updatedAt = moment(ret.updatedAt).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
      return ret;
    }
  }
});

module.exports = model('Payment', paymentSchema);