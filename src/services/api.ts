import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add token to headers if it exists in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getMe: () => api.get('/users/me'),
};

export const buildingService = {
  list: () => api.get('/buildings'),
  create: (data: any) => api.post('/buildings', data),
};

export const energyService = {
  getForecast: (buildingId: number) => api.get(`/forecast/${buildingId}`),
  uploadMeterData: (buildingId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/meter-data/${buildingId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const subscriptionService = {
  createCheckout: (priceId: string) => api.post('/subscriptions/create-checkout-session', { priceId }),
};

export default api;
