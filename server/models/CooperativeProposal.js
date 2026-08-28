const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  proposalCode: {
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
  yesVotes: {
    type: Number,
    default: 490
  },
  noVotes: {
    type: Number,
    default: 190
  },
  status: {
    type: String,
    enum: ['active', 'passed', 'closed'],
    default: 'active'
  },
  quorumRequired: {
    type: Number,
    default: 500
  },
  closesInDays: {
    type: Number,
    default: 3
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CooperativeProposal', proposalSchema);
