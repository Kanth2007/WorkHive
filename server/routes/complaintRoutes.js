const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const Worker = require('../models/Worker');

// 1. GET /api/complaints - Fetch grievances
router.get('/', async (req, res) => {
  try {
    const { status, category } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }
    if (category) {
      query.category = new RegExp(category, 'i');
    }

    const complaints = await Complaint.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: complaints.length, data: complaints });
  } catch (err) {
    console.error('Error fetching complaints:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving complaints', error: err.message });
  }
});

// 2. POST /api/complaints - File a new grievance
router.post('/', async (req, res) => {
  try {
    const { complainant, against, category, description, bookingId, complainantRole = 'Customer', complainantPhone = '' } = req.body;
    if (!complainant || !against || !category || !description) {
      return res.status(400).json({ success: false, message: 'Missing required complaint fields: complainant, against, category, description are required.' });
    }

    const complaintId = 'GRV-' + new Date().getFullYear() + '-' + Math.floor(10 + Math.random() * 90);
    const newComplaint = new Complaint({
      complaintId,
      complainant,
      complainantRole,
      complainantPhone,
      against,
      category,
      description,
      bookingId: bookingId || '',
      status: 'Open'
    });

    const saved = await newComplaint.save();
    res.status(201).json({ success: true, message: 'Complaint filed successfully', data: saved });
  } catch (err) {
    console.error('Error filing complaint:', err);
    res.status(500).json({ success: false, message: 'Failed to file complaint', error: err.message });
  }
});

// 3. PUT /api/complaints/:id - Update status / resolve / escalate to suspension
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionNotes, escalateSuspension } = req.body;

    const update = {};
    if (status) update.status = status;
    if (resolutionNotes) update.resolutionNotes = resolutionNotes;

    let complaint = await Complaint.findOneAndUpdate({ complaintId: id }, update, { new: true });
    if (!complaint && id.match(/^[0-9a-fA-F]{24}$/)) {
      complaint = await Complaint.findByIdAndUpdate(id, update, { new: true });
    }

    if (!complaint) {
      return res.status(404).json({ success: false, message: `Complaint with ID '${id}' not found` });
    }

    // If escalate to suspension was requested, update worker record
    if (escalateSuspension && complaint.against) {
      await Worker.findOneAndUpdate(
        { name: new RegExp(complaint.against, 'i') },
        { status: 'Suspended', isOnline: false, badge: 'Account Suspended' }
      );
    }

    res.json({ success: true, message: 'Complaint updated successfully', data: complaint });
  } catch (err) {
    console.error('Error updating complaint:', err);
    res.status(500).json({ success: false, message: 'Failed to update complaint', error: err.message });
  }
});

module.exports = router;
