import axios from 'axios';

// Logika untuk menentukan URL API yang benar
const baseURL = import.meta.env.MODE === 'production'
  ? 'https://api.stockwatch.web.id/api'
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: baseURL
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;