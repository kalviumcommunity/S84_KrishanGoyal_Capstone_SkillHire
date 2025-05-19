const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false },
  fullName: { type: String, required: true },
  phone: { type: String, required: false },
  profileImageUrl: { type: String, default: './defaultImage.png' },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  googleId: { type: String },
  role: {
    type: String,
    required: false,
    default: 'client',
    enum: ['client', 'go-worker', 'pro-worker']
  },
  isProfileComplete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },

  // Job posting (clients & pro-workers for pro jobs only)
  postedJobs: [{
    type: ObjectId,
    ref: 'Job'
  }],

  // Client ratings of workers
  ratingsGiven: [{
    workerId: { type: ObjectId, ref: 'User' },
    jobId: { type: ObjectId, ref: 'Job' },
    score: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],

  // Go Worker fields
  goSkills: [String],
  hourlyRate: Number,
  location: {
    city: String,
    subCity: String
  },
  isAvailable: { type: Boolean, default: false },
  completedJobs: { type: Number, default: 0 },

  // Pro Worker fields
  proSkills: [String],
  portfolioUrl: String,
  minProjectRate: Number,
  completedProjects: { type: Number, default: 0 },

  // Shared for workers
  ratingsReceived: [{
    clientId: { type: ObjectId, ref: 'User' },
    jobId: { type: ObjectId, ref: 'Job' },
    score: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  avgRating: { type: Number, default: 5 }
});

module.exports = model('User', UserSchema);
