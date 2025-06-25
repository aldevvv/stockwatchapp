import api from '../services/api.js';

export const getLeaderboard = (type = 'transactionCount') => {
  return api.get(`/leaderboard?type=${type}`);
};

export const recalculateLeaderboard = () => {
    return api.post('/leaderboard/recalculate');
};
