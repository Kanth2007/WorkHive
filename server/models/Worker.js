const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  workerId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  skill: {
    type: String,
    required: true
  },
  skills: [{
    type: String
  }],
  avatar: {
    type: String,
    default: 'RK'
  },
  matchScore: {
    type: Number,
    default: 95
  },
  rating: {
    type: Number,
    default: 4.8,
    min: 0,
    max: 5
  },

  reviewsCount: {
    type: Number,
    default: 0
  },
  experience: {
    type: String,
    default: '5 years'
  },
  distance: {
    type: String,
    default: '1.8 km away'
  },
  priceEstimate: {
    type: String,
    default: '₹450 estimated'
  },
  availability: {
    type: String,
    default: 'Available today in 30 mins'
  },
  status: {
    type: String,
    enum: ['Verified', 'Pending', 'Suspended'],
    default: 'Verified'
  },
  badge: {
    type: String,
    default: 'Verified Cooperative Worker'
  },
  societyReg: {
    type: String,
    default: 'Coop #TN-CHE-402'
  },
  bio: {
    type: String,
    default: ''
  },
  completedJobs: {
    type: Number,
    default: 0
  },
  onTimeRate: {
    type: String,
    default: '99%'
  },
  isOnline: {
    type: Boolean,
    default: true
  },
  locality: {
    type: String,
    default: 'Adyar, Chennai'
  },
  breakdown: {
    skillMatch: { type: String, default: '96%' },
    distanceVal: { type: String, default: '1.8 km (Nearest in Ward 4)' },
    availabilityVal: { type: String, default: '100% (Instant dispatch ready)' },
    ratingVal: { type: String, default: '4.8 / 5.0' },
    experienceVal: { type: String, default: '7 years cooperative service' }
  },
  documents: [{
    name: String,
    type: { type: String },
    verified: { type: Boolean, default: false }
  }],
  reviews: [{
    customerName: { type: String, default: 'Customer Member' },
    locality: { type: String, default: 'Ward 4, Chennai' },
    rating: { type: Number, default: 5 },
    comment: { type: String, default: '' },
    compliments: [String],
    date: { type: String }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Worker', workerSchema);
