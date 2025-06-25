import api from '../services/api';

export const getPlatformStats = () => {
    return api.get('/admin/stats');
};

export const getAllUsersProfiles = () => {
    return api.get('/admin/users');
};

export const getUserDetailsForAdmin = (userId) => {
    return api.get(`/admin/users/${userId}/details`);
};

export const addSaldoToUser = (targetUserId, jumlah, catatan) => {
    return api.post('/admin/users/add-saldo', { targetUserId, jumlah, catatan });
};

export const createRedeemCode = (codeData) => {
    return api.post('/admin/redeem-codes', codeData);
};

export const getAllRedeemCodes = () => {
    return api.get('/admin/redeem-codes');
};

export const updateRedeemCode = (codeId, codeData) => {
    return api.put(`/admin/redeem-codes/${codeId}`, codeData);
};

export const deleteRedeemCode = (codeId) => {
    return api.delete(`/admin/redeem-codes/${codeId}`);
};

export const manageUserAccount = (targetUserId, updateData) => {
    return api.put(`/admin/users/${targetUserId}/manage`, updateData);
};