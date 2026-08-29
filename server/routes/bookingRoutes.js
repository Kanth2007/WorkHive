const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const AdminMetric = require('../models/AdminMetric');
const Worker = require('../models/Worker');

// 1. GET /api/bookings - Fetch bookings with optional status, worker, or customer query
router.get('/', async (req, res) => {
  try {
    const { status, workerId, customerPhone, customerId, customerName, limit = 100 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      if (status === 'Emergency') {
        query.isEmergency = true;
      } else {
        query.status = status.toLowerCase().replace(/\s+/g, '_');
      }
    }

    if (workerId) {
      query.workerId = workerId;
    }

    if (customerPhone || customerId || customerName) {
      const orClauses = [];
      if (customerId) {
        orClauses.push({ customerId });
      }
      if (customerPhone) {
        const cleanPhone = customerPhone.replace(/\D/g, '').slice(-10);
        orClauses.push({ customerPhone });
        if (cleanPhone.length >= 7) {
          orClauses.push({ customerPhone: new RegExp(cleanPhone, 'i') });
        }
      }
      if (customerName && !['Member', 'Customer', 'Customer Member'].includes(customerName)) {
        orClauses.push({ customerName: new RegExp(customerName, 'i') });
      }
      if (orClauses.length > 0) {
        query.$or = orClauses;
      }
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 }).limit(parseInt(limit));
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving bookings', error: err.message });
  }
});

// 2. GET /api/bookings/:id - Fetch single booking
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let booking = await Booking.findOne({ bookingId: id });
    if (!booking && id.match(/^[0-9a-fA-F]{24}$/)) {
      booking = await Booking.findById(id);
    }

    if (!booking) {
      return res.status(404).json({ success: false, message: `Booking with ID '${id}' not found` });
    }

    res.json({ success: true, data: booking });
  } catch (err) {
    console.error('Error fetching booking:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve booking', error: err.message });
  }
});

// 3. POST /api/bookings - Create new customer booking
router.post('/', async (req, res) => {
  try {
    const {
      customerName,
      customerId,
      customerPhone,
      customerAddress,
      serviceCategory,
      serviceDetails,
      workerId,
      workerName,
      amount,
      isEmergency = false
    } = req.body;

    if (!customerName || !customerPhone || !serviceCategory || !amount) {
      return res.status(400).json({ success: false, message: 'Missing required booking fields: customerName, customerPhone, serviceCategory, and amount are required.' });
    }

    const bookingId = req.body.bookingId || 'BK-' + Math.floor(1000 + Math.random() * 9000);

    const newBooking = new Booking({
      bookingId,
      customerName,
      customerId: customerId || '',
      customerPhone,
      customerAddress: customerAddress || 'Ward 4, Adyar, Chennai',
      serviceCategory,
      serviceDetails: serviceDetails || `${serviceCategory} service request`,
      workerId: workerId || 'ravi-kumar',
      workerName: workerName || 'Ravi Kumar',
      amount: Number(amount) || 450,
      status: 'pending',
      isEmergency,
      arrivalPin: String(Math.floor(1000 + Math.random() * 9000))
    });

    const saved = await newBooking.save();

    // Increment today's jobs and pending jobs in Admin metrics
    await AdminMetric.findOneAndUpdate(
      { metricKey: 'primary_node_metrics' },
      { $inc: { todayJobs: 1, pendingJobs: 1 } },
      { upsert: true }
    );

    res.status(201).json({ success: true, message: 'Booking created successfully in MongoDB', data: saved });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ success: false, message: 'Failed to create booking', error: err.message });
  }
});

// 4. PUT /api/bookings/:id/status - Update booking lifecycle (Accepted, On the way, Arrived, Working, Completed, Paid, Rated)
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, isLocationSharing, rating, feedback, paymentMethod } = req.body;

    const updateFields = {};
    if (status) updateFields.status = status;
    if (isLocationSharing !== undefined) updateFields.isLocationSharing = isLocationSharing;
    if (rating !== undefined) updateFields.rating = rating;
    if (feedback !== undefined) updateFields.feedback = feedback;
    if (paymentMethod) updateFields.paymentMethod = paymentMethod;

    let booking = await Booking.findOneAndUpdate({ bookingId: id }, updateFields, { new: true });
    if (!booking && id.match(/^[0-9a-fA-F]{24}$/)) {
      booking = await Booking.findByIdAndUpdate(id, updateFields, { new: true });
    }

    if (!booking) {
      return res.status(404).json({ success: false, message: `Booking with ID '${id}' not found` });
    }

    // If marked completed or paid, update metrics
    if (status === 'completed') {
      const gross = booking.amount;
      const workerTakeHome = Math.round(gross * 0.9);
      const welfareFund = gross - workerTakeHome;

      await Promise.all([
        AdminMetric.findOneAndUpdate(
          { metricKey: 'primary_node_metrics' },
          {
            $inc: {
              completedJobs: 1,
              pendingJobs: -1,
              totalEarningsDistributed: workerTakeHome,
              welfareFundBalance: welfareFund
            }
          }
        ),
        Worker.findOneAndUpdate(
          { workerId: booking.workerId },
          { $inc: { completedJobs: 1 } }
        )
      ]);
    }

    res.json({ success: true, message: `Booking status updated to ${status}`, data: booking });
  } catch (err) {
    console.error('Error updating booking status:', err);
    res.status(500).json({ success: false, message: 'Failed to update booking status', error: err.message });
  }
});

// 5. DELETE /api/bookings/:id - Cancel or delete a booking
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let booking = await Booking.findOneAndDelete({ bookingId: id });
    if (!booking && id.match(/^[0-9a-fA-F]{24}$/)) {
      booking = await Booking.findByIdAndDelete(id);
    }

    if (!booking) {
      return res.status(404).json({ success: false, message: `Booking with ID '${id}' not found` });
    }

    res.json({ success: true, message: 'Booking removed successfully', data: booking });
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(500).json({ success: false, message: 'Failed to delete booking', error: err.message });
  }
});

module.exports = router;
