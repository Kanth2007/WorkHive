const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  serviceId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'Wrench'
  },
  emoji: {
    type: String,
    default: '🔧'
  },
  baseRate: {
    type: String,
    required: true
  },
  rateNumber: {
    type: Number,
    default: 350
  },
  duration: {
    type: String,
    default: '1 - 2 hours'
  },
  popular: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    required: true
  },
  availableWorkersCount: {
    type: Number,
    default: 8
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);
