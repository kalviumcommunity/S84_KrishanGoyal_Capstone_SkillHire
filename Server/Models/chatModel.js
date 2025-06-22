const { Schema, model } = require('mongoose');

const ChatSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    refPath: 'projectType',
    required: true
  },
  projectType: {
    type: String,
    enum: ['ProProject', 'GoProject'],
    required: true
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
  initiatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastMessage: {
    content: String,
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: Date
  },
  unreadClient: {
    type: Number,
    default: 0
  },
  unreadWorker: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const chatModel = model('Chat', ChatSchema)
module.exports = chatModel