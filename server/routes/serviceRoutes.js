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

// 3. POST /api/services - Create a new service
router.post('/', async (req, res) => {
  try {
    const { title, description, baseRate, category } = req.body;
    if (!title || !description || !baseRate || !category) {
      return res.status(400).json({ success: false, message: 'Title, description, baseRate, and category are required' });
    }

    const serviceId = req.body.serviceId || title.toLowerCase().replace(/\s+/g, '-');
    const newService = new Service({
      serviceId,
      ...req.body
    });

    const saved = await newService.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error('Error creating service:', err);
// 4. PUT /api/services/:id - Update an existing service
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Service.findOneAndUpdate(
      { $or: [{ serviceId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
      req.body,
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

// 5. DELETE /api/services/:id - Delete a service
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Service.findOneAndDelete({ serviceId: id });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, message: 'Service deleted from catalog' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete service', error: err.message });
  }
});

module.exports = router;

