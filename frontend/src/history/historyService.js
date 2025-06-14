import api from '../services/api.js';

export const getHistory = (filters = {}) => {
  return api.get('/history', {
    params: filters
  });
};