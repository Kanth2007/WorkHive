const User = require('../models/User');
const Worker = require('../models/Worker');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const Complaint = require('../models/Complaint');
const CooperativeProposal = require('../models/CooperativeProposal');
const WelfareClaim = require('../models/WelfareClaim');
const AdminMetric = require('../models/AdminMetric');

// 1. DEMO USERS FOR EACH ROLE
const initialUsers = [
  // CUSTOMER DEMO USER
  {
    userId: 'cus-1001',
    name: 'Priya Sundaram',
    phone: '+91 98401 23456',
    email: 'customer@chennailabour.coop',
    password: 'customer123',
    role: 'customer',
    locality: 'Ward 4, Kasturba Nagar, Adyar, Chennai',
    societyId: 'TN-CHE-2024-88402',
    status: 'Active',
    avatar: 'PS',
    userCategory: 'household'
  },
  // WORKER DEMO USER (Plumber)
  {
    userId: 'ravi-kumar',
    name: 'Ravi Kumar',
    phone: '+91 98401 11223',
    email: 'worker@chennailabour.coop',
    password: 'worker123',
    role: 'worker',
    locality: 'Ward 4, Adyar, Chennai',
    societyId: 'Coop #TN-CHE-402',
    skill: 'Plumbing & Emergency Pipe Specialist',
    status: 'Verified',
    avatar: 'RK',
    userCategory: 'worker'
  },
  // WORKER DEMO USER 2 (Electrician)
  {
    userId: 'arun-electrician',
    name: 'Arun',
    phone: '+91 98402 33445',
    email: 'arun@chennailabour.coop',
    password: 'worker123',
    role: 'worker',
    locality: 'Ward 4, Besant Nagar, Chennai',
    societyId: 'Coop #TN-CHE-109',
    skill: 'Electrical & Home Wiring',
    status: 'Verified',
    avatar: 'AR',
    userCategory: 'worker'
  },
  // ADMIN DEMO USER (Ward 4 Officer)
  {
    userId: 'adm-1001',
    name: 'Cooperative Officer S. Ramanathan',
    phone: '+91 98401 99999',
    email: 'admin@chennailabour.coop',
    password: 'admin123',
    role: 'admin',
    locality: 'Ward 4 Node Office, Adyar, Chennai',
    societyId: 'TN-CHE-2024-WARD4',
    status: 'Active',
    avatar: 'AD',
    userCategory: 'officer'
  }
];

// 2. COMPREHENSIVE WORKER PROFILES
const initialWorkers = [
  {
    workerId: 'ravi-kumar',
    name: 'Ravi Kumar',
    phone: '+91 98401 11223',
    skill: 'Plumbing & Emergency Pipe Specialist',
    skills: ['Plumbing', 'Pipe Repair', 'Tap Installation', 'Tank Setup'],
    avatar: 'RK',
    matchScore: 96,
    rating: 4.8,
    reviewsCount: 240,
    experience: '7 years',
    distance: '1.8 km away',
    priceEstimate: '₹450 estimated',
    availability: 'Available today in 30 mins',
    status: 'Verified',
    badge: 'Verified Cooperative Worker',
    societyReg: 'Coop #TN-CHE-402',
    bio: 'Specialist in kitchen pipeline leakages, tap replacements, sanitary repairs, and overhead tank pipelines. Fully background checked and society certified.',
    completedJobs: 127,
    onTimeRate: '99%',
    isOnline: true,
    locality: 'Ward 4, Adyar, Chennai',
    breakdown: {
      skillMatch: '96%',
      distanceVal: '1.8 km (Nearest in Ward 4)',
      availabilityVal: '100% (Instant dispatch ready)',
      ratingVal: '4.8 / 5.0 (240 jobs)',
      experienceVal: '7 years cooperative service'
    },
    documents: [
      { name: 'Aadhaar Card', type: 'ID Proof', verified: true },
      { name: 'Plumbing ITI Diploma Certificate', type: 'Skill Cert', verified: true },
      { name: 'Cooperative Society Membership Passbook', type: 'Society Reg', verified: true }
    ]
  },
  {
    workerId: 'arun-electrician',
    name: 'Arun',
    phone: '+91 98402 33445',
    skill: 'Electrical & Home Wiring',
    skills: ['Electrical', 'Wiring', 'Switchboard', 'Inverter Setup'],
    avatar: 'AR',
    matchScore: 94,
    rating: 4.7,
    reviewsCount: 98,
    experience: '6 years',
    distance: '2.4 km away',
    priceEstimate: '₹350 estimated',
    availability: 'Available today in 45 mins',
    status: 'Verified',
    badge: 'Verified Cooperative Worker',
    societyReg: 'Coop #TN-CHE-109',
    bio: 'Certified electrician specializing in short-circuit triage, ceiling fan installations, and MCB breaker diagnostics.',
    completedJobs: 98,
    onTimeRate: '98%',
    isOnline: true,
    locality: 'Ward 4, Besant Nagar, Chennai',
    breakdown: {
      skillMatch: '94%',
      distanceVal: '2.4 km away',
      availabilityVal: '95%',
      ratingVal: '4.7 / 5.0 (98 jobs)',
      experienceVal: '6 years cooperative service'
    },
    documents: [
      { name: 'Aadhaar Card', type: 'ID Proof', verified: true },
      { name: 'Wireman License (TN Electrical Board)', type: 'License', verified: true }
    ]
  },
  {
    workerId: 'sunita-shinde',
    name: 'Sunita Shinde',
    phone: '+91 98404 55667',
    skill: 'Deep Cleaning Specialist',
    skills: ['Deep Cleaning', 'Sanitation', 'Kitchen Degreasing', 'Floor Polishing'],
    avatar: 'SS',
    matchScore: 95,
    rating: 4.9,
    reviewsCount: 310,
    experience: '5 years',
    distance: '2.3 km away',
    priceEstimate: '₹350 estimated',
    availability: 'Available today (from 2:00 PM)',
    status: 'Verified',
    badge: 'Verified Cooperative Worker',
    societyReg: 'Coop #TN-CHE-318',
    bio: 'Deep house cleaning, kitchen de-greasing, bathroom sanitation, and eco-friendly cleaning supplies certified.',
    completedJobs: 310,
    onTimeRate: '100%',
    isOnline: true,
    locality: 'Ward 4, Adyar, Chennai',
    breakdown: {
      skillMatch: '96%',
      distanceVal: '2.3 km away',
      availabilityVal: '95%',
      ratingVal: '4.9 / 5.0 (310 jobs)',
      experienceVal: '5 years cooperative service'
    },
    documents: [
      { name: 'Aadhaar Card', type: 'ID Proof', verified: true },
      { name: 'Hygiene & Chemical Safety Certification', type: 'Cert', verified: true }
    ]
  },
  {
    workerId: 'santosh-more',
    name: 'Santosh More',
    phone: '+91 98405 66778',
    skill: 'Plumbing & Drainage',
    skills: ['Plumbing', 'Drainage', 'Pipe Replacement'],
    avatar: 'SM',
    matchScore: 92,
    rating: 4.7,
    reviewsCount: 185,
    experience: '6 years',
    distance: '2.9 km away',
    priceEstimate: '₹300 estimated',
    availability: 'Available today in 1 hour',
    status: 'Verified',
    badge: 'Verified Cooperative Worker',
    societyReg: 'Coop #TN-CHE-290',
    bio: 'Leak detection, tap & valve replacements, overhead tank connections, and emergency pipeline drainage unblocking.',
    completedJobs: 185,
    onTimeRate: '97%',
    isOnline: true,
    locality: 'Ward 4, Gandhi Nagar, Chennai',
    breakdown: {
      skillMatch: '93%',
      distanceVal: '2.9 km away',
      availabilityVal: '90%',
      ratingVal: '4.7 / 5.0',
      experienceVal: '6 years cooperative service'
    },
    documents: [
      { name: 'Aadhaar Card', type: 'ID Proof', verified: true }
    ]
  },
  {
    workerId: 'lata-gaikwad',
    name: 'Lata Gaikwad',
    phone: '+91 98406 77889',
    skill: 'Elder Care & Domestic Assistance',
    skills: ['Elder Care', 'Patient Mobility', 'Medicine Tracking', 'Dietary Support'],
    avatar: 'LG',
    matchScore: 89,
    rating: 5.0,
    reviewsCount: 190,
    experience: '8 years',
    distance: '3.4 km away',
    priceEstimate: '₹450 estimated',
    availability: 'Available today',
    status: 'Verified',
    badge: 'Verified Cooperative Worker',
    societyReg: 'Coop #TN-CHE-104',
    bio: 'Patient and empathetic daytime caregiver. Specialized in elder mobility assistance, post-surgery recovery help, and medicine tracking.',
    completedJobs: 190,
    onTimeRate: '100%',
    isOnline: true,
    locality: 'Ward 4, Shastri Nagar, Chennai',
    breakdown: {
      skillMatch: '90%',
      distanceVal: '3.4 km away',
      availabilityVal: '88%',
      ratingVal: '5.0 / 5.0',
      experienceVal: '8 years cooperative service'
    },
    documents: [
      { name: 'Aadhaar Card', type: 'ID Proof', verified: true },
      { name: 'Geriatric Nursing Assistant Diploma', type: 'Medical Cert', verified: true }
    ]
  },
  {
    workerId: 'vignesh-mason',
    name: 'Vignesh S.',
    phone: '+91 98407 88990',
    skill: 'Masonry & Tiling',
    skills: ['Masonry', 'Floor Tiling', 'Wall Plastering'],
    avatar: 'VS',
    matchScore: 91,
    rating: 4.8,
    reviewsCount: 114,
    experience: '9 years',
    distance: '2.0 km away',
    priceEstimate: '₹500 estimated',
    availability: 'Available tomorrow',
    status: 'Verified',
    badge: 'Verified Cooperative Worker',
    societyReg: 'Coop #TN-CHE-512',
    bio: 'Expert mason with over 9 years in tile replacement, water-proofing, and precision compound wall repairs.',
    completedJobs: 114,
    onTimeRate: '98%',
    isOnline: true,
    locality: 'Ward 4, Adyar, Chennai',
    documents: [{ name: 'Aadhaar Card', type: 'ID Proof', verified: true }]
  },
  {
    workerId: 'karthik-appliance',
    name: 'Karthik R.',
    phone: '+91 98409 00112',
    skill: 'Appliance Technician',
    skills: ['Appliance Repair', 'Washing Machine', 'Refrigerator', 'Microwave'],
    avatar: 'KR',
    matchScore: 93,
    rating: 4.9,
    reviewsCount: 145,
    experience: '7 years',
    distance: '1.5 km away',
    priceEstimate: '₹350 estimated',
    availability: 'Available today in 15 mins',
    status: 'Verified',
    badge: 'Verified Cooperative Worker',
    societyReg: 'Coop #TN-CHE-440',
    bio: 'Certified technician for washing machine PCB repair, refrigerator gas refill, and microwave inverter diagnostics.',
    completedJobs: 145,
    onTimeRate: '99%',
    isOnline: true,
    locality: 'Ward 4, Kasturba Nagar, Chennai',
    documents: [{ name: 'Aadhaar Card', type: 'ID Proof', verified: true }]
  },
  {
    workerId: 'kumar-carpenter',
    name: 'Kumar',
    phone: '+91 98403 44556',
    skill: 'Carpentry & Furniture Works',
    skills: ['Carpentry', 'Furniture Repair', 'Door Hinges', 'Wood Polishing'],
    avatar: 'KU',
    matchScore: 88,
    rating: 0,
    reviewsCount: 0,
    experience: '4 years',
    distance: '3.1 km away',
    priceEstimate: '₹400 estimated',
    availability: 'Pending verification review',
    status: 'Pending',
    badge: 'Pending Verification',
    societyReg: 'Coop #TN-CHE-Pending',
    bio: 'Skilled carpenter with expertise in door alignment, modular cabinet hinges, and custom table restoration.',
    completedJobs: 0,
    onTimeRate: '100%',
    isOnline: false,
    locality: 'Ward 4, Thiruvanmiyur, Chennai',
    documents: [
      { name: 'Aadhaar Card', type: 'ID Proof', verified: true },
      { name: 'Apprenticeship Letter', type: 'Experience Proof', verified: false }
    ]
  },
  {
    workerId: 'dinesh-painter',
    name: 'Dinesh Pillai',
    phone: '+91 98408 99001',
    skill: 'Wall Painting & Waterproofing',
    skills: ['Painting', 'Waterproofing', 'Primer Coating'],
    avatar: 'DP',
    matchScore: 87,
    rating: 4.6,
    reviewsCount: 82,
    experience: '5 years',
    distance: '3.8 km away',
    priceEstimate: '₹400 estimated',
    availability: 'Under suspension review',
    status: 'Suspended',
    badge: 'Account Suspended',
    societyReg: 'Coop #TN-CHE-201',
    bio: 'Interior and exterior painting services. Currently suspended pending resolution of dispute #GRV-2026-02.',
    completedJobs: 82,
    onTimeRate: '92%',
    isOnline: false,
    locality: 'Ward 4, Kotturpuram, Chennai',
    documents: [{ name: 'Aadhaar Card', type: 'ID Proof', verified: true }]
  }
];

// 3. COMPLETE SERVICES CATALOG
const initialServices = [
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
    category: 'Repairs',
    availableWorkersCount: 9
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
    category: 'Repairs',
    availableWorkersCount: 14
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
    category: 'Household',
    availableWorkersCount: 11
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
    category: 'Repairs',
    availableWorkersCount: 7
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
    category: 'Household',
    availableWorkersCount: 6
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
    category: 'Caregiving',
    availableWorkersCount: 8
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
    category: 'Household',
    availableWorkersCount: 5
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
    category: 'Repairs',
    availableWorkersCount: 8
  }
];

// 4. REALISTIC LIVE BOOKINGS
const initialBookings = [
  {
    bookingId: 'BK-1048',
    customerName: 'Priya Sundaram',
    customerPhone: '+91 98401 23456',
    customerAddress: 'Door 14, 2nd Main Road, Kasturba Nagar, Adyar, Chennai',
    serviceCategory: 'Plumbing',
    serviceDetails: 'Kitchen pipe leakage under sink',
    workerId: 'ravi-kumar',
    workerName: 'Ravi Kumar',
    amount: 450,
    status: 'completed',
    isLocationSharing: false,
    rating: 5,
    feedback: 'Excellent work by Ravi, very punctual and resolved the kitchen leakage cleanly!',
    arrivalPin: '8821',
    paymentMethod: 'upi',
    dateString: 'Today, 4:45 PM'
  },
  {
    bookingId: 'BK-1047',
    customerName: 'Anand Kulkarni',
    customerPhone: '+91 98402 11223',
    customerAddress: 'Flat 302, Gokul Heights, Besant Nagar',
    serviceCategory: 'Electrical',
    serviceDetails: 'Main switchboard sparking & fuse replacement',
    workerId: 'arun-electrician',
    workerName: 'Arun',
    amount: 350,
    status: 'in_progress',
    isLocationSharing: true,
    rating: 0,
    arrivalPin: '4192',
    paymentMethod: 'upi',
    dateString: 'Today, 3:30 PM'
  },
  {
    bookingId: 'BK-1046',
    customerName: 'Meera Deshmukh',
    customerPhone: '+91 98403 88990',
    customerAddress: 'Row House 12, Sahakar Nagar, Adyar',
    serviceCategory: 'Cleaning',
    serviceDetails: 'Kitchen and 2 bathrooms deep sanitation',
    workerId: 'sunita-shinde',
    workerName: 'Sunita Shinde',
    amount: 400,
    status: 'completed',
    isLocationSharing: false,
    rating: 5,
    feedback: 'Spotless cleaning, very professional service.',
    arrivalPin: '7721',
    paymentMethod: 'cash',
    dateString: 'Today, 10:00 AM'
  }
];

// 5. GRIEVANCES & COMPLAINTS
const initialComplaints = [
  {
    complaintId: 'GRV-2026-01',
    complainant: 'Prakash Joshi',
    complainantRole: 'Customer',
    against: 'Santosh More',
    category: 'Late arrival',
    date: '27 Aug 2026',
    status: 'Resolved',
    description: 'Worker arrived 40 minutes after scheduled window without phone notice.',
    bookingId: 'BK-1038',
    resolutionNotes: 'Worker apologized, cooperative credited ₹50 convenience voucher to customer.'
  },
  {
    complaintId: 'GRV-2026-02',
    complainant: 'Kavita Raman',
    complainantRole: 'Customer',
    against: 'Dinesh Pillai',
    category: 'Payment dispute',
    date: '26 Aug 2026',
    status: 'Investigating',
    description: 'Worker demanded ₹150 extra beyond the agreed cooperative tariff for paint primer.',
    bookingId: 'BK-1035',
    resolutionNotes: 'Ward coordinator reviewing material receipts.'
  },
  {
    complaintId: 'GRV-2026-03',
    complainant: 'Sunita Shinde',
    complainantRole: 'Worker',
    against: 'Customer #CU-9912 (Thiruvanmiyur)',
    category: 'Safety',
    date: '25 Aug 2026',
    status: 'Resolved',
    description: 'Unleashed aggressive dog inside premises caused delay and safety hazard.',
    bookingId: 'BK-1029',
    resolutionNotes: 'Customer reminded of cooperative worker pet safety protocol; flagged for future visits.'
  }
];

// 6. DEMOCRATIC COOPERATIVE PROPOSALS
const initialProposals = [
  {
    proposalCode: 'PROP-2026-04',
    title: 'Should 5% of cooperative surplus be allocated to emergency worker assistance?',
    description: 'This resolution authorizes the cooperative committee to earmark 5% of monthly surplus revenues (approx. ₹7,140/mo) into an immediate, zero-interest emergency hardship grant pool for active members facing medical or extreme weather distress.',
    yesVotes: 490,
    noVotes: 190,
    status: 'active',
    quorumRequired: 500,
    closesInDays: 3
  },
  {
    proposalCode: 'PROP-2026-03',
    title: 'Increase monsoon safety tool subsidy pool from ₹2,000 to ₹2,500',
    description: 'Increase annual safety gear allowance for all active electricians and plumbers ahead of monsoon season.',
    yesVotes: 610,
    noVotes: 82,
    status: 'passed',
    quorumRequired: 500,
    closesInDays: 0
  },
  {
    proposalCode: 'PROP-2026-02',
    title: 'Partner with Apollo Reach Clinic for 24x7 emergency worker helpline',
    description: 'Establish direct cooperative health desk for emergency on-duty coverage.',
    yesVotes: 722,
    noVotes: 46,
    status: 'passed',
    quorumRequired: 500,
    closesInDays: 0
  }
];

// 7. WELFARE CLAIMS
const initialClaims = [
  {
    title: 'Cashless Medical Hospitalization',
    recipient: 'Murugan P. (Electrician)',
    amount: '₹42,500',
    amountNum: 42500,
    date: '22 Aug 2026',
    status: 'Settled',
    category: 'Health Insurance'
  },
  {
    title: 'Tool Upgrade & Safety Gear Subsidy',
    recipient: 'Ravi Kumar (Plumber)',
    amount: '₹2,450',
    amountNum: 2450,
    date: '18 Aug 2026',
    status: 'Settled',
    category: 'Tool Subsidy'
  },
  {
    title: 'Emergency Community Credit (0% APR)',
    recipient: 'Sunita Shinde (Caregiver)',
    amount: '₹15,000',
    amountNum: 15000,
    date: '14 Aug 2026',
    status: 'Disbursed',
    category: 'Emergency Relief'
  }
];

// 8. WARD NODE METRICS
const initialMetrics = {
  metricKey: 'primary_node_metrics',
  totalWorkers: 1248,
  activeWorkers: 937,
  todayJobs: 428,
  completedJobs: 391,
  pendingJobs: 37,
  totalEarningsDistributed: 2845600,
  welfareFundBalance: 316170,
  coopSurplus: 142800,
  averageRating: 4.85
};

// Seed / Sync directly into MongoDB Atlas
const seedDatabase = async (force = true) => {
  try {
    const userCount = await User.countDocuments();
    const workerCount = await Worker.countDocuments();
    const serviceCount = await Service.countDocuments();

    if (force || userCount === 0 || workerCount === 0 || serviceCount === 0) {
      console.log('[MongoDB] Populating collections with complete dataset in Atlas...');

      await Promise.all([
        User.deleteMany({}),
        Worker.deleteMany({}),
        Service.deleteMany({}),
        Booking.deleteMany({}),
        Complaint.deleteMany({}),
        CooperativeProposal.deleteMany({}),
        WelfareClaim.deleteMany({}),
        AdminMetric.deleteMany({})
      ]);

      await Promise.all([
        User.insertMany(initialUsers),
        Worker.insertMany(initialWorkers),
        Service.insertMany(initialServices),
        Booking.insertMany(initialBookings),
        Complaint.insertMany(initialComplaints),
        CooperativeProposal.insertMany(initialProposals),
        WelfareClaim.insertMany(initialClaims),
        AdminMetric.findOneAndUpdate(
          { metricKey: 'primary_node_metrics' },
          initialMetrics,
          { upsert: true, new: true }
        )
      ]);

      const [uC, wC, sC, bC, cC, pC] = await Promise.all([
        User.countDocuments(),
        Worker.countDocuments(),
        Service.countDocuments(),
        Booking.countDocuments(),
        Complaint.countDocuments(),
        CooperativeProposal.countDocuments()
      ]);

      console.log(`[MongoDB] Atlas successfully populated: ${uC} users, ${wC} workers, ${sC} services, ${bC} bookings, ${cC} complaints, ${pC} proposals.`);
    } else {
      console.log(`[MongoDB] Database already populated with ${workerCount} workers & ${userCount} users.`);
    }
  } catch (err) {
    console.error('[MongoDB] Seeding error:', err);
  }
};

module.exports = {
  seedDatabase,
  initialUsers,
  initialWorkers,
  initialServices,
  initialBookings,
  initialComplaints,
  initialProposals,
  initialClaims,
  initialMetrics
};
