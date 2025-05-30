import api from '../services/api.js'; 

export const getUserProfile = () => {
  return api.get('/users/profile');
};

export const updateUserProfile = (userData) => {
  return api.put('/users/profile', userData);
};