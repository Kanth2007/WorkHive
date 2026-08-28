const express = require('express');
const router = express.Router();
const { seedDatabase } = require('../db/seed');
const AdminMetric = require('../models/AdminMetric');
const Worker = require('../models/Worker');
const Booking = require('../models/Booking');

// 1. GET /api/admin/stats - Live primary admin dashboard telemetry
router.get('/stats', async (req, res) => {
  try {
    let metrics = await AdminMetric.findOne({ metricKey: 'primary_node_metrics' });
    if (!metrics) {
      metrics = await AdminMetric.create({ metricKey: 'primary_node_metrics' });
    }

    const totalWorkers = await Worker.countDocuments();
    const activeWorkers = await Worker.countDocuments({ isOnline: true });
    const completedJobsCount = await Booking.countDocuments({ status: { $in: ['completed', 'paid', 'rated'] } });

    res.json({
      success: true,
      data: {
        totalWorkers: totalWorkers || metrics.totalWorkers,
        activeWorkers: activeWorkers || metrics.activeWorkers,
        todayJobs: metrics.todayJobs,
        completedJobs: completedJobsCount || metrics.completedJobs,
        pendingJobs: metrics.pendingJobs,
        totalEarningsDistributed: metrics.totalEarningsDistributed,
        welfareFundBalance: metrics.welfareFundBalance,
        coopSurplus: metrics.coopSurplus,
        averageRating: metrics.averageRating
      }
    });
  } catch (err) {
    console.error('Error retrieving admin stats:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve admin stats', error: err.message });
  }
});

// 2. POST /api/admin/reset-demo - Clean slate re-seed for presentation runs
router.post('/reset-demo', async (req, res) => {
  try {
    await seedDatabase(true);
    res.json({ success: true, message: 'MongoDB data reset to pristine seed state.' });
  } catch (err) {
    console.error('Error resetting demo database:', err);
    res.status(500).json({ success: false, message: 'Failed to reset demo database', error: err.message });
  }
});

module.exports = router;
