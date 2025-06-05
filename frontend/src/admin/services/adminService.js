// frontend/src/admin/services/adminService.js
import api from '../../services/api.js'; // Sesuaikan path ke instance axios terpusat Anda

export const getAllUsersProfilesAdmin = () => {
  return api.get('/admin/users');
};

export const getUserStockForAdmin = (targetUserId) => {
  return api.get(`/admin/users/${targetUserId}/stok`);
};

// FUNGSI BARU
export const sendMessageToUserByAdmin = (messageData) => {
  // messageData = { targetUserId, subject, messageBody }
  return api.post('/admin/messages/send', messageData);
};

// FUNGSI BARU
export const getPlatformStatsAdmin = () => {
  return api.get('/admin/stats');
};