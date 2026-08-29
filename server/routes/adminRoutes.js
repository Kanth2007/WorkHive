const express = require('express');
const router = express.Router();
const { seedDatabase } = require('../db/seed');
const AdminMetric = require('../models/AdminMetric');
const Worker = require('../models/Worker');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Complaint = require('../models/Complaint');
const WelfareClaim = require('../models/WelfareClaim');

// 1. GET /api/admin/stats or /api/admin/metrics - Live primary admin dashboard telemetry
router.get(['/stats', '/metrics'], async (req, res) => {
  try {
    const totalWorkers = await Worker.countDocuments();
    const verifiedWorkers = await Worker.countDocuments({ status: 'Verified' });
    const activeWorkers = await Worker.countDocuments({ isOnline: true });
    
    const allBookings = await Booking.find();
    const completedJobs = allBookings.filter(b => ['completed', 'paid', 'rated'].includes(b.status));
    const pendingJobs = allBookings.filter(b => ['pending', 'accepted', 'in_progress'].includes(b.status));
    
    const totalGross = completedJobs.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
    const totalEarningsDistributed = Math.round(totalGross * 0.90);
    const welfareFundBalance = Math.round(totalGross * 0.10);
    const coopSurplus = Math.round(totalGross * 0.05);

    const totalComplaints = await Complaint.countDocuments();
    const totalServices = await Service.countDocuments();
    const totalClaims = await WelfareClaim.countDocuments();

    res.json({
      success: true,
      data: {
        totalWorkers,
        verifiedWorkers,
        activeWorkers,
        todayJobs: allBookings.length,
        completedJobs: completedJobs.length,
        pendingJobs: pendingJobs.length,
        totalEarningsDistributed,
        welfareFundBalance,
        coopSurplus,
        averageRating: 5.0,
        totalComplaints,
        totalServices,
        totalClaims
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
