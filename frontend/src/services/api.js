import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password, device_id) => api.post('/auth/register', { email, password, device_id }),
};

export const energy = {
  getLiveData: () => api.get('/live-data'),
  getHistory: (period) => api.get(`/history?period=${period}`),
  getMonthlyCost: () => api.get('/monthly-cost'),
  getPeakUsage: () => api.get('/peak-usage'),
  generateReport: (startDate, endDate) => api.get(`/report?startDate=${startDate}&endDate=${endDate}`, { responseType: 'blob' }),
  getSettings: () => api.get('/settings'),
  updateSettings: (settings) => api.put('/settings', settings),
};

export default api;
