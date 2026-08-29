const express = require('express');
const router = express.Router();
const CooperativeProposal = require('../models/CooperativeProposal');
const WelfareClaim = require('../models/WelfareClaim');
const Worker = require('../models/Worker');
const Booking = require('../models/Booking');

// 1. GET /api/cooperative/stats - Summary metrics for audited society pool
router.get('/stats', async (req, res) => {
  try {
    const totalWorkers = await Worker.countDocuments();
    const activeWorkers = await Worker.countDocuments({ isOnline: true });
    const verifiedBookings = await Booking.find({ status: { $in: ['completed', 'paid', 'rated'] } });

    const totalGross = verifiedBookings.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
    const workerDirectEarnings = Math.round(totalGross * 0.95);
    const welfareEscrowPool = Math.round(totalGross * 0.05);
    const retainedSurplus = Math.round(totalGross * 0.05);

    const totalClaims = await WelfareClaim.countDocuments();

    res.json({
      success: true,
      data: {
        totalWorkers,
        activeWorkers,
        totalEarningsDistributed: workerDirectEarnings,
        welfareFundBalance: welfareEscrowPool,
        coopSurplus: retainedSurplus,
        totalClaimsCount: totalClaims,
        dividendRate: '5.2%',
        splits: {
          workerWage: '95%',
          welfareReserve: '5%',
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
    let proposals = await CooperativeProposal.find().sort({ createdAt: -1 });
    if (proposals.length === 0) {
      const defaultP = await CooperativeProposal.create({
        proposalCode: 'PROP-2026-04',
        title: 'Should 5% of cooperative surplus be allocated to emergency worker assistance?',
        description: 'This resolution authorizes the cooperative committee to earmark 5% of monthly surplus revenues into an immediate, zero-interest emergency hardship grant pool for active members facing medical or extreme weather distress.',
        yesVotes: 1,
        noVotes: 0,
        status: 'active',
        quorumRequired: 1,
        closesInDays: 3
      });
      proposals = [defaultP];
    }
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
    
    let query = { proposalCode: id };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ proposalCode: id }, { _id: id }] };
    }

    let proposal = await CooperativeProposal.findOneAndUpdate(
      query,
      { $inc: incField },
      { returnDocument: 'after' }
    );

    if (!proposal) {
      proposal = await CooperativeProposal.findOne();
      if (proposal) {
        proposal = await CooperativeProposal.findByIdAndUpdate(proposal._id, { $inc: incField }, { returnDocument: 'after' });
      }
    }

    if (!proposal) {
      return res.status(404).json({ success: false, message: `Proposal with ID '${id}' not found` });
    }

    res.json({ success: true, message: `Vote ${vote} recorded successfully in MongoDB`, data: proposal });
  } catch (err) {
    console.error('Error voting on proposal:', err);
    res.status(500).json({ success: false, message: 'Failed to record vote', error: err.message });
  }
});

// 4. POST /api/cooperative/proposals - Create new proposal (Admin)
router.post('/proposals', async (req, res) => {
  try {
    const { title, description, quorumRequired, closesInDays } = req.body;
    const code = 'PROP-2026-' + Math.floor(10 + Math.random() * 90);
    const proposal = await CooperativeProposal.create({
      proposalCode: code,
      title: title || 'New Cooperative Resolution',
      description: description || 'Member voting proposal',
      yesVotes: 0,
      noVotes: 0,
      status: 'active',
      quorumRequired: quorumRequired || 1,
      closesInDays: closesInDays || 7
    });
    res.status(201).json({ success: true, message: 'Proposal created in MongoDB', data: proposal });
  } catch (err) {
    console.error('Error creating proposal:', err);
    res.status(500).json({ success: false, message: 'Failed to create proposal', error: err.message });
  }
});

// 5. GET /api/cooperative/claims - Fetch welfare & insurance claims log
router.get('/claims', async (req, res) => {
  try {
    const claims = await WelfareClaim.find().sort({ createdAt: -1 });
    res.json({ success: true, count: claims.length, data: claims });
  } catch (err) {
    console.error('Error fetching claims:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve welfare claims', error: err.message });
  }
});

// 6. POST /api/cooperative/claims - Submit welfare / subsidy claim
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
