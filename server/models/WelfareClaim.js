const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  recipient: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  amountNum: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    default: () => new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  },
  status: {
    type: String,
    enum: ['Settled', 'Disbursed', 'Pending Review'],
    default: 'Settled'
  },
  category: {
    type: String,
    default: 'Medical & Accident'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WelfareClaim', claimSchema);
