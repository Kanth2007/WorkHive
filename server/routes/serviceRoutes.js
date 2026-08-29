const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// 1. GET /api/services - Fetch all services with optional category or keyword filtering
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = {};

    if (category) {
      query.category = new RegExp(category, 'i');
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ];
    }

    const services = await Service.find(query).sort({ popular: -1, title: 1 });
    res.json({ success: true, count: services.length, data: services });
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving services', error: err.message });
  }
});

// 2. GET /api/services/:id - Fetch single service
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let service = await Service.findOne({ serviceId: id });
    if (!service && id.match(/^[0-9a-fA-F]{24}$/)) {
      service = await Service.findById(id);
    }

    if (!service) {
      return res.status(404).json({ success: false, message: `Service with ID '${id}' not found` });
    }

    res.json({ success: true, data: service });
  } catch (err) {
    console.error('Error fetching service:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve service', error: err.message });
  }
});

// 3. POST /api/services - Create or upsert a new service/job
router.post('/', async (req, res) => {
  try {
    const { title, description, baseRate, category } = req.body;
    if (!title || !description || !baseRate || !category) {
      return res.status(400).json({ success: false, message: 'Title, description, baseRate, and category are required' });
    }

    const cleanTitleSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const serviceId = req.body.serviceId || (cleanTitleSlug.length > 0 ? cleanTitleSlug : `job-${Date.now()}`);
    
    // Numerical rate extraction
    const rawRate = req.body.rateNumber || parseInt(String(baseRate).replace(/[^0-9]/g, '')) || 350;
    const formattedBaseRate = typeof baseRate === 'number' ? `₹${baseRate} visit fee` : baseRate;

    // Check if existing service with same serviceId exists
    const existing = await Service.findOne({ serviceId });
    if (existing) {
      const updated = await Service.findOneAndUpdate(
        { serviceId },
        {
          ...req.body,
          serviceId,
          rateNumber: rawRate,
          baseRate: formattedBaseRate
        },
        { new: true }
      );
      return res.status(200).json({ success: true, message: 'Service updated in catalog', data: updated });
    }

    const newService = new Service({
      serviceId,
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      baseRate: formattedBaseRate,
      rateNumber: rawRate,
      duration: req.body.duration || '1 - 2 hours',
      emoji: req.body.emoji || '🔧',
      icon: req.body.icon || 'Wrench',
      popular: Boolean(req.body.popular),
      availableWorkersCount: req.body.availableWorkersCount || 0
    });

    const saved = await newService.save();
    res.status(201).json({ success: true, message: 'New service created successfully in MongoDB', data: saved });
  } catch (err) {
    console.error('Error creating service:', err);
    res.status(500).json({ success: false, message: 'Failed to create service: ' + err.message, error: err.message });
  }
});

// 4. PUT /api/services/:id - Update an existing service
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (updateData.baseRate && !updateData.rateNumber) {
      updateData.rateNumber = parseInt(String(updateData.baseRate).replace(/[^0-9]/g, '')) || 350;
    }

    const updated = await Service.findOneAndUpdate(
      { $or: [{ serviceId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: `Service '${id}' not found to update` });
    }

    res.json({ success: true, message: 'Service updated successfully in MongoDB', data: updated });
  } catch (err) {
    console.error('Error updating service:', err);
    res.status(500).json({ success: false, message: 'Failed to update service', error: err.message });
  }
});

// 5. DELETE /api/services/:id - Delete a service from catalog
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Service.findOneAndDelete({
      $or: [{ serviceId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Service not found in catalog' });
    }
    res.json({ success: true, message: 'Service successfully deleted from catalog' });
  } catch (err) {
    console.error('Error deleting service:', err);
    res.status(500).json({ success: false, message: 'Failed to delete service', error: err.message });
  }
});

module.exports = router;
