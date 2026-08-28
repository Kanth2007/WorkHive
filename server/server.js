require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./db/connection');
const { seedDatabase } = require('./db/seed');

// Import modular routes
const authRoutes = require('./routes/authRoutes');
const workerRoutes = require('./routes/workerRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const cooperativeRoutes = require('./routes/cooperativeRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/cooperative', cooperativeRoutes);
app.use('/api/admin', adminRoutes);


// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbState = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

  res.json({
    status: 'ok',
    service: 'Sahakari Seva Enterprise API Server',
    database: {
      engine: 'MongoDB',
      status: states[dbState] || 'unknown',
      connected: dbState === 1
    },
    timestamp: new Date().toISOString()
  });
});

// Legacy backward compatibility route for quick stats
app.get('/api/stats', async (req, res) => {
  const AdminMetric = require('./models/AdminMetric');
  try {
    const metrics = await AdminMetric.findOne({ metricKey: 'primary_node_metrics' });
    res.json(metrics || {});
  } catch (err) {
    res.json({});
  }
});

// 404 handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route '${req.originalUrl}' not found.`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Initialize MongoDB & Start Server
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`[Sahakari Seva] API Server actively listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Fatal error starting Sahakari Seva server:', err);
    process.exit(1);
  }
};

startServer();
