const axios = require('axios');

const API = 'http://localhost:5000/api';

async function testAllRolesAuth() {
  console.log('=== 1. Testing Customer Registration & Login ===');
  const custReg = await axios.post(`${API}/auth/register`, {
    name: 'Kavita Sundaram',
    phone: '+91 98401 99881',
    email: 'kavita@chennaimember.in',
    password: 'customerPass123',
    role: 'customer',
    locality: 'Ward 4, Adyar, Chennai',
    userCategory: 'household'
  });
  console.log('Customer Registered:', custReg.data.data.name, 'Role:', custReg.data.data.role);

  const custLogin = await axios.post(`${API}/auth/login`, {
    identifier: '+91 98401 99881',
    password: 'customerPass123',
    role: 'customer'
  });
  console.log('Customer Logged In:', custLogin.data.message);

  console.log('\n=== 2. Testing Worker Registration & Login ===');
  const workerReg = await axios.post(`${API}/auth/register`, {
    name: 'Muthuvel Karunanidhi',
    phone: '+91 98402 77661',
    email: 'muthuvel@chennailabour.coop',
    password: 'workerPass123',
    role: 'worker',
    skill: 'Plumbing',
    experience: '6 years',
    locality: 'Ward 4, Adyar'
  });
  console.log('Worker Registered:', workerReg.data.data.name, 'Skill:', workerReg.data.data.skill);

  const workerLogin = await axios.post(`${API}/auth/login`, {
    identifier: '+91 98402 77661',
    password: 'workerPass123',
    role: 'worker'
  });
  console.log('Worker Logged In:', workerLogin.data.message);

  console.log('\n=== 3. Testing Admin / Officer Registration & Login ===');
  const adminReg = await axios.post(`${API}/auth/register`, {
    name: 'Rajendran S.',
    phone: '+91 98400 11001',
    email: 'rajendran@chennailabour.coop',
    password: 'adminPass123',
    role: 'admin',
    societyId: 'TN-CHE-2024-88402',
    locality: 'Ward 4 Operations Desk'
  });
  console.log('Admin Registered:', adminReg.data.data.name, 'Role:', adminReg.data.data.role);

  const adminLogin = await axios.post(`${API}/auth/login`, {
    identifier: 'rajendran@chennailabour.coop',
    password: 'adminPass123',
    role: 'admin'
  });
  console.log('Admin Logged In:', adminLogin.data.message);

  console.log('\n=== 4. Testing Mobile OTP Send & Verification ===');
  const sendOtpRes = await axios.post(`${API}/auth/send-otp`, { phone: '+91 98405 55443' });
  console.log('OTP Sent:', sendOtpRes.data.message);

  const verifyOtpRes = await axios.post(`${API}/auth/verify-otp`, {
    phone: '+91 98405 55443',
    otp: '8821',
    role: 'customer',
    name: 'Deepak Shah'
  });
  console.log('OTP Verified User:', verifyOtpRes.data.data.name, 'Role:', verifyOtpRes.data.data.role);

  console.log('\n✅ ALL 3 ROLES (CUSTOMER, WORKER, ADMIN) AUTH, SIGN UP, REGISTER, AND LOGIN PASSED WITH 100% SUCCESS!');
}

testAllRolesAuth().catch((err) => {
  console.error('Auth test failed:', err.response?.data || err.message);
  process.exit(1);
});
