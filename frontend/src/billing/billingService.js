import api from '../services/api.js';

export const redeemCode = (kode) => {
  return api.post('/billing/redeem', { kode });
};

export const getSaldoHistory = () => {
    return api.get('/billing/history');
};

export const upgradePlan = (targetPlan) => {
    return api.post('/billing/upgrade', { targetPlan });
};

export const getPlanDetails = () => {
    return api.get('/billing/plans');
};
