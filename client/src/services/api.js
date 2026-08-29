import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Authentication API
export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials).then(res => res.data),
  register: (userData) => apiClient.post('/auth/register', userData).then(res => res.data),
  sendOtp: (phone) => apiClient.post('/auth/send-otp', { phone }).then(res => res.data),
  verifyOtp: (payload) => apiClient.post('/auth/verify-otp', payload).then(res => res.data),
  getMe: (params) => apiClient.get('/auth/me', { params }).then(res => res.data),
  updateProfile: (data) => apiClient.put('/auth/profile', data).then(res => res.data)
};


// Workers API

export const workersAPI = {
  getAll: (params) => apiClient.get('/workers', { params }).then(res => res.data),
  getById: (id) => apiClient.get(`/workers/${id}`).then(res => res.data),
  create: (data) => apiClient.post('/workers', data).then(res => res.data),
  update: (id, data) => apiClient.put(`/workers/${id}`, data).then(res => res.data),
  delete: (id) => apiClient.delete(`/workers/${id}`).then(res => res.data)
};

// Services API
export const servicesAPI = {
  getAll: (params) => apiClient.get('/services', { params }).then(res => res.data),
  getById: (id) => apiClient.get(`/services/${id}`).then(res => res.data),
  create: (data) => apiClient.post('/services', data).then(res => res.data),
  update: (id, data) => apiClient.put(`/services/${id}`, data).then(res => res.data),
  delete: (id) => apiClient.delete(`/services/${id}`).then(res => res.data)
};

// Bookings API
export const bookingsAPI = {
  getAll: (params) => apiClient.get('/bookings', { params }).then(res => res.data),
  getById: (id) => apiClient.get(`/bookings/${id}`).then(res => res.data),
  create: (data) => apiClient.post('/bookings', data).then(res => res.data),
  updateStatus: (id, data) => apiClient.put(`/bookings/${id}/status`, data).then(res => res.data),
  delete: (id) => apiClient.delete(`/bookings/${id}`).then(res => res.data)
};

// Complaints API
export const complaintsAPI = {
  getAll: (params) => apiClient.get('/complaints', { params }).then(res => res.data),
  create: (data) => apiClient.post('/complaints', data).then(res => res.data),
  update: (id, data) => apiClient.put(`/complaints/${id}`, data).then(res => res.data)
};

export const cooperativeAPI = {
  getStats: () => apiClient.get('/cooperative/stats').then(res => res.data),
  getProposals: () => apiClient.get('/cooperative/proposals').then(res => res.data),
  voteProposal: (id, vote) => apiClient.post(`/cooperative/proposals/${id}/vote`, { vote }).then(res => res.data),
  createProposal: (data) => apiClient.post('/cooperative/proposals', data).then(res => res.data),
  getClaims: () => apiClient.get('/cooperative/claims').then(res => res.data),
  createClaim: (data) => apiClient.post('/cooperative/claims', data).then(res => res.data)
};

// Admin API
export const adminAPI = {
  getStats: () => apiClient.get('/admin/stats').then(res => res.data),
  getCustomers: () => apiClient.get('/admin/customers').then(res => res.data),
  resetDemo: () => apiClient.post('/admin/reset-demo').then(res => res.data)
};

// System Health API
export const healthAPI = {
  check: () => apiClient.get('/health').then(res => res.data)
};

export default apiClient;
