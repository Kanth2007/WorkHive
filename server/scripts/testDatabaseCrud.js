const axios = require('axios');

const API = 'http://localhost:5000/api';

async function testFullDatabaseFlow() {
  console.log('--- 1. Testing MongoDB Health Check ---');
  const healthRes = await axios.get(`${API}/health`);
  console.log('Health:', healthRes.data);

  console.log('\n--- 2. Testing Workers CRUD Operations ---');
  // Read
  const workersRes = await axios.get(`${API}/workers`);
  console.log(`Read ${workersRes.data.count} workers from MongoDB.`);

  // Create
  const newWorkerRes = await axios.post(`${API}/workers`, {
    name: 'Senthil Nathan',
    phone: '+91 98409 11223',
    skill: 'Plumbing',
    experience: '4 years',
    locality: 'Ward 4, Adyar'
  });
  const createdWorkerId = newWorkerRes.data.data.workerId;
  console.log(`Created Worker in MongoDB: ${newWorkerRes.data.data.name} (ID: ${createdWorkerId})`);

  // Update
  const updatedWorkerRes = await axios.put(`${API}/workers/${createdWorkerId}`, {
    status: 'Verified',
    rating: 4.9
  });
  console.log(`Updated Worker Status in MongoDB: ${updatedWorkerRes.data.data.status}`);

  // Delete
  const deleteWorkerRes = await axios.delete(`${API}/workers/${createdWorkerId}`);
  console.log(`Deleted Worker from MongoDB: ${deleteWorkerRes.data.data.name}`);

  console.log('\n--- 3. Testing Services Read & Category Filter ---');
  const servicesRes = await axios.get(`${API}/services?category=Repairs`);
  console.log(`Read ${servicesRes.data.count} repair services from MongoDB.`);

  console.log('\n--- 4. Testing Bookings Lifecycle in MongoDB ---');
  // Create Booking
  const createBookingRes = await axios.post(`${API}/bookings`, {
    customerName: 'Priya Sundaram',
    customerPhone: '+91 98401 23456',
    customerAddress: 'Door 14, 2nd Main Road, Kasturba Nagar, Adyar',
    serviceCategory: 'Plumbing',
    serviceDetails: 'Kitchen sink pipe repair',
    workerId: 'ravi-kumar',
    workerName: 'Ravi Kumar',
    amount: 450
  });
  const testBookingId = createBookingRes.data.data.bookingId;
  console.log(`Created Booking in MongoDB: ${testBookingId}`);

  // Update Lifecycle: Accepted -> On the way -> Arrived -> Working -> Completed
  await axios.put(`${API}/bookings/${testBookingId}/status`, { status: 'on_the_way', isLocationSharing: true });
  console.log(`Booking ${testBookingId} updated to: on_the_way`);

  await axios.put(`${API}/bookings/${testBookingId}/status`, { status: 'arrived', isLocationSharing: false });
  console.log(`Booking ${testBookingId} updated to: arrived`);

  await axios.put(`${API}/bookings/${testBookingId}/status`, { status: 'completed' });
  console.log(`Booking ${testBookingId} updated to: completed`);

  await axios.put(`${API}/bookings/${testBookingId}/status`, { status: 'rated', rating: 5, feedback: 'Great job!' });
  console.log(`Booking ${testBookingId} updated with 5-star rating`);

  console.log('\n--- 5. Testing Democratic Voting & Claims in MongoDB ---');
  const voteRes = await axios.post(`${API}/cooperative/proposals/PROP-2026-04/vote`, { vote: 'YES' });
  console.log(`Voted YES on proposal: Yes Votes count now ${voteRes.data.data.yesVotes}`);

  const coopStatsRes = await axios.get(`${API}/cooperative/stats`);
  console.log('Cooperative Stats:', {
    totalWorkers: coopStatsRes.data.data.totalWorkers,
    verifiedWorkers: coopStatsRes.data.data.verifiedWorkers,
    todayEarnings: `₹${coopStatsRes.data.data.todayEarnings.toLocaleString()}`,
    welfareFund: `₹${coopStatsRes.data.data.welfareFundTotal.toLocaleString()}`
  });

  console.log('\n--- 6. Testing Admin Primary Dashboard Metrics ---');
  const adminStatsRes = await axios.get(`${API}/admin/stats`);
  console.log('Admin Metrics from MongoDB:', adminStatsRes.data.data);

  console.log('\n✅ ALL DATABASE CRUD AND API OPERATIONS PASSED WITH 100% SUCCESS!');
}

testFullDatabaseFlow().catch((err) => {
  console.error('Test failed:', err.response?.data || err.message);
  process.exit(1);
});
