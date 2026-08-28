const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  customerAddress: {
    type: String,
    required: true
  },
  serviceCategory: {
    type: String,
    required: true
  },
  serviceDetails: {
    type: String,
    default: ''
  },
  workerId: {
    type: String,
    required: true
  },
  workerName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'on_the_way', 'arrived', 'working', 'in_progress', 'completed', 'paid', 'rated', 'cancelled'],
    default: 'pending'
  },

  isLocationSharing: {
    type: Boolean,
    default: false
  },
  isEmergency: {
    type: Boolean,
    default: false
  },
  arrivalPin: {
    type: String,
    default: '8821'
  },
  rating: {
    type: Number,
    default: 0
  },
  feedback: {
    type: String,
    default: ''
  },
  paymentMethod: {
    type: String,
    default: 'upi'
  },
  dateString: {
    type: String,
    default: () => new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
