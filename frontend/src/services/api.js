import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Delivery API
export const deliveryAPI = {
  createDelivery: (data) => api.post('/deliveries', data),
  getMyDeliveries: () => api.get('/deliveries/my-deliveries'),
  checkOrders: (data) => api.post('/deliveries/check-orders', data),
  acceptDelivery: (id) => api.put(`/deliveries/${id}/accept`),
  startDelivery: (id) => api.put(`/deliveries/${id}/start`),
  completeDelivery: (id, otp) => api.put(`/deliveries/${id}/complete`, { otp }),
  getMyJobs: () => api.get('/deliveries/my-jobs'),
};

// Journey API
export const journeyAPI = {
  createJourney: (data) => api.post('/journeys', data),
  getMyJourneys: () => api.get('/journeys/my-journeys'),
  updateJourneyStatus: (id, status) => api.put(`/journeys/${id}`, { status }),
};

export default api;
