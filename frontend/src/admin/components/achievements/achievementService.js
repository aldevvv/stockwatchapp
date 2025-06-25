import api from '../../../services/api';

export const getAchievementsStatus = () => {
    return api.get('/achievements');
};