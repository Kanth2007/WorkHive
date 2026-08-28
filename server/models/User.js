const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
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
    required: true,
    index: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    default: 'password123'
  },
  role: {
    type: String,
    enum: ['customer', 'worker', 'admin'],
    default: 'customer',
    required: true
  },
  locality: {
    type: String,
    default: 'Ward 4, Adyar, Chennai'
  },
  societyId: {
    type: String,
    default: 'TN-CHE-2024-88402'
  },
  skill: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Active', 'Verified', 'Pending', 'Suspended'],
    default: 'Active'
  },
  avatar: {
    type: String,
    default: 'U'
  },
  userCategory: {
    type: String,
    enum: ['household', 'institution', 'worker', 'officer'],
    default: 'household'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
