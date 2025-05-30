import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password,
  });
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

export const verifyEmailToken = (token) => {
  return axios.get(`http://localhost:5000/api/auth/verify-email/${token}`);
};

export const requestPasswordReset = async (email) => {
  const response = await axios.post(`${API_URL}/request-password-reset`, { email });
  return response.data;
};

export const resetPassword = async (token, password, confirmPassword) => {
  const response = await axios.post(`${API_URL}/reset-password/${token}`, { password, confirmPassword });
  return response.data;
};