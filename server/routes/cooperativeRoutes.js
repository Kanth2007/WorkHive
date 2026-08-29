const express = require('express');
const router = express.Router();
const CooperativeProposal = require('../models/CooperativeProposal');
const WelfareClaim = require('../models/WelfareClaim');
const AdminMetric = require('../models/AdminMetric');
const Worker = require('../models/Worker');
const Booking = require('../models/Booking');

// 1. GET /api/cooperative/stats - Fetch audited cooperative economics ledger
router.get('/stats', async (req, res) => {
  try {
    const metrics = await AdminMetric.findOne({ metricKey: 'primary_node_metrics' });
    const verifiedWorkersCount = await Worker.countDocuments({ status: 'Verified' });
    const totalWorkersCount = await Worker.countDocuments();
    const activeWorkersCount = await Worker.countDocuments({ isOnline: true });
    const completedBookings = await Booking.find({ status: { $in: ['completed', 'paid', 'rated'] } });
    
    const liveGrossTotal = completedBookings.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
    const liveWelfareBalance = Math.round(liveGrossTotal * 0.10);
    const liveWorkerEarnings = Math.round(liveGrossTotal * 0.90);

    res.json({
      success: true,
      data: {
        totalWorkers: totalWorkersCount,
        verifiedWorkers: verifiedWorkersCount,
        activeWorkers: activeWorkersCount,
        todayEarnings: liveWorkerEarnings || metrics?.totalEarningsDistributed || 0,
        welfareFundTotal: liveWelfareBalance || metrics?.welfareFundBalance || 0,
        coopSurplus: Math.round(liveGrossTotal * 0.05) || metrics?.coopSurplus || 0,
        todayJobs: await Booking.countDocuments(),
        completedJobs: completedBookings.length,
        pendingJobs: await Booking.countDocuments({ status: { $in: ['pending', 'accepted', 'in_progress'] } }),
        payoutSplit: {
          workerTakeHome: '90%',
          welfareReserve: '10%',
          platformCut: '0%'
        },
        societyName: 'Chennai Central Labour Cooperative Society Ltd.',
        registrationNumber: 'TN-CHE-2024-88402'
      }
    });
  } catch (err) {
    console.error('Error fetching cooperative stats:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve cooperative stats', error: err.message });
  }
});

// 2. GET /api/cooperative/proposals - Fetch member democratic voting proposals
router.get('/proposals', async (req, res) => {
  try {
    const proposals = await CooperativeProposal.find().sort({ createdAt: -1 });
    res.json({ success: true, count: proposals.length, data: proposals });
  } catch (err) {
    console.error('Error fetching proposals:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve proposals', error: err.message });
  }
});

// 3. POST /api/cooperative/proposals/:id/vote - Cast democratic vote on a proposal
router.post('/proposals/:id/vote', async (req, res) => {
  try {
    const { id } = req.params;
    const { vote } = req.body; // 'YES' or 'NO'

    if (!vote || (vote !== 'YES' && vote !== 'NO')) {
      return res.status(400).json({ success: false, message: 'Invalid vote parameter: must be YES or NO' });
    }

    const incField = vote === 'YES' ? { yesVotes: 1 } : { noVotes: 1 };
    let proposal = await CooperativeProposal.findOneAndUpdate(
      { $or: [{ proposalCode: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
      { $inc: incField },
      { returnDocument: 'after' }
    );

    if (!proposal) {
      return res.status(404).json({ success: false, message: `Proposal with ID '${id}' not found` });
    }

    res.json({ success: true, message: `Vote ${vote} recorded successfully in MongoDB`, data: proposal });
  } catch (err) {
    console.error('Error voting on proposal:', err);
    res.status(500).json({ success: false, message: 'Failed to record vote', error: err.message });
  }
});

// 4. GET /api/cooperative/claims - Fetch welfare & insurance claims log
router.get('/claims', async (req, res) => {
  try {
    const claims = await WelfareClaim.find().sort({ createdAt: -1 });
    res.json({ success: true, count: claims.length, data: claims });
  } catch (err) {
    console.error('Error fetching claims:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve welfare claims', error: err.message });
  }
});

// 5. POST /api/cooperative/claims - Submit welfare / subsidy claim
router.post('/claims', async (req, res) => {
  try {
    const { title, workerId, workerName, amount, category, details } = req.body;
    const claimId = 'CLM-' + Math.floor(1000 + Math.random() * 9000);
    const claim = await WelfareClaim.create({
      claimId,
      title: title || 'Tool Upgrade & Safety Gear Subsidy',
      recipient: workerName ? `${workerName} (Member)` : 'Cooperative Worker',
      workerId: workerId || 'worker',
      amount: Number(amount) || 0,
      category: category || 'tool_subsidy',
      details: details || 'Approved by Ward 4 Cooperative Society',
      status: 'Settled',
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    });

    res.status(201).json({ success: true, message: 'Welfare claim submitted and approved in MongoDB', data: claim });
  } catch (err) {
    console.error('Error creating welfare claim:', err);
    res.status(500).json({ success: false, message: 'Failed to create welfare claim', error: err.message });
  }
});

module.exports = router;
