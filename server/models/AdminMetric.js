const mongoose = require('mongoose');

const adminMetricSchema = new mongoose.Schema({
  metricKey: {
    type: String,
    required: true,
    unique: true,
    default: 'primary_node_metrics'
  },
  totalWorkers: {
    type: Number,
    default: 1248
  },
  activeWorkers: {
    type: Number,
    default: 937
  },
  todayJobs: {
    type: Number,
    default: 428
  },
  completedJobs: {
    type: Number,
    default: 391
  },
  pendingJobs: {
    type: Number,
    default: 37
  },
  totalEarningsDistributed: {
    type: Number,
    default: 2845600
  },
  welfareFundBalance: {
    type: Number,
    default: 316170
  },
  coopSurplus: {
    type: Number,
    default: 142800
  },
  averageRating: {
    type: Number,
    default: 4.85
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AdminMetric', adminMetricSchema);
