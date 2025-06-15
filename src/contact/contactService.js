import api from '../services/api';

export const sendContactMessage = (contactData) => {
  return api.post('/contact', contactData);
};