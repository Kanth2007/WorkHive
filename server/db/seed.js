const User = require('../models/User');
const Worker = require('../models/Worker');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const Complaint = require('../models/Complaint');
const CooperativeProposal = require('../models/CooperativeProposal');
const WelfareClaim = require('../models/WelfareClaim');
const AdminMetric = require('../models/AdminMetric');

// Standard cooperative service categories catalog
const defaultServices = [
  {
    serviceId: 'plumber',
    title: 'Plumber & Pipe Repairs',
    description: 'Tap leakages, kitchen drainage, pipe blocks, and overhead tank setups.',
    icon: 'Wrench',
    emoji: '🔧',
    baseRate: '₹300 fixed visit fee',
    rateNumber: 300,
    duration: '1 - 2 hours',
    popular: true,
    category: 'Repairs'
  },
  {
    serviceId: 'electrician',
    title: 'Electrician & Wiring',
    description: 'Switchboards, MCB trippings, fan installations, and inverter lines.',
    icon: 'Zap',
    emoji: '⚡',
    baseRate: '₹250 fixed visit fee',
    rateNumber: 250,
    duration: '1 - 2 hours',
    popular: true,
    category: 'Repairs'
  },
  {
    serviceId: 'cleaning',
    title: 'Home Deep Cleaning',
    description: 'Kitchen degreasing, bathroom sanitation, and complete house sanitization.',
    icon: 'Sparkles',
    emoji: '✨',
    baseRate: '₹350 / session',
    rateNumber: 350,
    duration: '2 - 3 hours',
    popular: true,
    category: 'Household'
  },
  {
    serviceId: 'carpenter',
    title: 'Carpentry & Woodwork',
    description: 'Door hinge alignment, modular furniture repairs, and locks fitting.',
    icon: 'Hammer',
    emoji: '🪚',
    baseRate: '₹350 fixed visit fee',
    rateNumber: 350,
    duration: '1 - 3 hours',
    popular: false,
    category: 'Repairs'
  },
  {
    serviceId: 'painter',
    title: 'Painting & Waterproofing',
    description: 'Wall touch-ups, weather-proof coatings, and stain removal.',
    icon: 'Paintbrush',
    emoji: '🎨',
    baseRate: '₹400 / room',
    rateNumber: 400,
    duration: '3 - 5 hours',
    popular: false,
    category: 'Household'
  },
  {
    serviceId: 'caregiver',
    title: 'Elder Care Assistance',
    description: 'Daytime assistance, companion care, mobility support, and medicine tracking.',
    icon: 'HeartPulse',
    emoji: '🩺',
    baseRate: '₹450 / day',
    rateNumber: 450,
    duration: '4 - 8 hours',
    popular: true,
    category: 'Caregiving'
  },
  {
    serviceId: 'gardener',
    title: 'Garden & Plant Care',
    description: 'Balcony garden setup, pruning, organic compost, and pest treatment.',
    icon: 'Sprout',
    emoji: '🌱',
    baseRate: '₹280 / session',
    rateNumber: 280,
    duration: '1 - 2 hours',
    popular: false,
    category: 'Household'
  },
  {
    serviceId: 'technician',
    title: 'Appliance Repair',
    description: 'AC servicing, washing machines, refrigerators, and RO water purifiers.',
    icon: 'Cpu',
    emoji: '⚙️',
    baseRate: '₹350 fixed visit fee',
    rateNumber: 350,
    duration: '1 - 2 hours',
    popular: true,
    category: 'Repairs'
  }
];

// Clean wipe of all data from MongoDB
const clearAllDatabaseData = async () => {
  try {
    console.log('[MongoDB] Clearing all collections from database...');
    await Promise.all([
      User.deleteMany({}),
      Worker.deleteMany({}),
      Booking.deleteMany({}),
      Complaint.deleteMany({}),
      CooperativeProposal.deleteMany({}),
      WelfareClaim.deleteMany({}),
      AdminMetric.deleteMany({}),
      Service.deleteMany({})
    ]);

    // Re-seed standard services catalog so booking categories exist
    await Service.insertMany(defaultServices);

    // Initialize clean zeroed admin metrics document
    await AdminMetric.create({
      metricKey: 'primary_node_metrics',
      totalWorkers: 0,
      activeWorkers: 0,
      todayJobs: 0,
      completedJobs: 0,
      pendingJobs: 0,
      totalEarningsDistributed: 0,
      welfareFundBalance: 0,
      coopSurplus: 0,
      averageRating: 5.0
    });

    console.log('[MongoDB] Database successfully cleared of all dummy data! Standard service catalog initialized.');
  } catch (err) {
    console.error('[MongoDB] Error clearing database:', err);
  }
};

const seedDatabase = async (force = false) => {
  try {
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      await Service.insertMany(defaultServices);
      console.log('[MongoDB] Standard service catalog initialized.');
    }
  } catch (err) {
    console.error('[MongoDB] Seeding error:', err);
  }
};

module.exports = {
  clearAllDatabaseData,
  seedDatabase,
  defaultServices
};
