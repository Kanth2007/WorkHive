const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaintId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  complainant: {
    type: String,
    required: true
  },
  complainantRole: {
    type: String,
    enum: ['Customer', 'Worker'],
    default: 'Customer'
  },
  against: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  date: {
    type: String,
    default: () => new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  },
  status: {
    type: String,
    enum: ['Open', 'Investigating', 'Resolved'],
    default: 'Open'
  },
  description: {
    type: String,
    required: true
  },
  bookingId: {
    type: String,
    default: ''
  },
  resolutionNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Complaint', complaintSchema);
