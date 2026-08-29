const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');

// 1. GET /api/workers - Fetch all workers with optional search, skill, and status filtering
router.get('/', async (req, res) => {
  try {
    const { skill, status, search, limit = 50 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (skill) {
      query.$or = [
        { skill: new RegExp(skill, 'i') },
        { skills: new RegExp(skill, 'i') }
      ];
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { skill: searchRegex },
        { locality: searchRegex },
        { societyReg: searchRegex }
      ];
    }

    const workers = await Worker.find(query).sort({ rating: -1, completedJobs: -1 }).limit(parseInt(limit));
    res.json({ success: true, count: workers.length, data: workers });
  } catch (err) {
    console.error('Error fetching workers:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving workers', error: err.message });
  }
});

// 2. GET /api/workers/:id - Fetch single worker by workerId or MongoDB _id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let worker = await Worker.findOne({ workerId: id });
    if (!worker && id.match(/^[0-9a-fA-F]{24}$/)) {
      worker = await Worker.findById(id);
    }

    if (!worker) {
      return res.status(404).json({ success: false, message: `Worker with ID '${id}' not found` });
    }

    res.json({ success: true, data: worker });
  } catch (err) {
    console.error('Error fetching worker:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving worker profile', error: err.message });
  }
});

// 3. POST /api/workers - Create / Register a new worker
router.post('/', async (req, res) => {
  try {
    const { name, phone, skill, experience, locality, documents = [] } = req.body;

    if (!name || !phone || !skill) {
      return res.status(400).json({ success: false, message: 'Missing required fields: name, phone, and skill are required.' });
    }

    const workerId = req.body.workerId || 'wrk-' + Date.now();
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase() || 'WK';

    const newWorker = new Worker({
      workerId,
      name,
      phone,
      skill,
      skills: [skill],
      avatar: initials,
      experience: experience || '1 year',
      locality: locality || 'Ward 4, Chennai',
      status: 'Pending',
      badge: 'Pending Verification',
      societyReg: `Coop #TN-CHE-${Math.floor(100 + Math.random() * 900)}`,
      documents
    });

    const savedWorker = await newWorker.save();
    res.status(201).json({ success: true, message: 'Worker registered successfully for cooperative verification', data: savedWorker });
  } catch (err) {
    console.error('Error creating worker:', err);
    res.status(500).json({ success: false, message: 'Failed to create worker', error: err.message });
  }
});

// 4. PUT /api/workers/:id - Update worker details / status / verification / online toggle
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    let worker = await Worker.findOneAndUpdate({ workerId: id }, updates, { new: true, runValidators: true });
    if (!worker && id.match(/^[0-9a-fA-F]{24}$/)) {
      worker = await Worker.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    }

    if (!worker) {
      return res.status(404).json({ success: false, message: `Worker with ID '${id}' not found` });
    }

    res.json({ success: true, message: 'Worker updated successfully', data: worker });
  } catch (err) {
    console.error('Error updating worker:', err);
    res.status(500).json({ success: false, message: 'Failed to update worker', error: err.message });
  }
});

// 6. POST /api/workers/:id/reviews - Add customer review and recalculate average rating
router.post('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { customerName, locality, rating, comment, compliments = [] } = req.body;

    let worker = await Worker.findOne({ workerId: id });
    if (!worker && id.match(/^[0-9a-fA-F]{24}$/)) {
      worker = await Worker.findById(id);
    }

    if (!worker) {
      return res.status(404).json({ success: false, message: `Worker with ID '${id}' not found` });
    }

    const numRating = Number(rating) || 5;
    const newReview = {
      customerName: customerName || 'Customer Member',
      locality: locality || 'Ward 4, Chennai',
      rating: numRating,
      comment: comment || 'Service completed satisfactorily.',
      compliments,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    if (!Array.isArray(worker.reviews)) {
      worker.reviews = [];
    }

    worker.reviews.unshift(newReview);
    worker.reviewsCount = worker.reviews.length;

    // Recalculate average rating
    const sumRatings = worker.reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
    worker.rating = Number((sumRatings / worker.reviews.length).toFixed(1));

    await worker.save();

    res.status(201).json({ success: true, message: 'Review added successfully', data: worker });
  } catch (err) {
    console.error('Error adding worker review:', err);
    res.status(500).json({ success: false, message: 'Failed to add review', error: err.message });
  }
});

module.exports = router;
