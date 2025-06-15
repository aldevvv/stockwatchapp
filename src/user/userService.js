import api from '../services/api.js';

export const getUserProfile = () => {
  return api.get('/users/profile');
};

export const updateUserProfile = (userData) => {
  return api.put('/users/profile', userData);
};

export const changePassword = (passwordData) => {
  return api.post('/users/profile/change-password', passwordData);
};

export const deleteUserAccount = async (password) => {
    return api.delete('/users/me', { data: { password } });
};

export const deactivateAccount = async (password) => {
    return api.post('/users/deactivate', { password });
};

export const uploadProfilePicture = (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file); 

    return api.post('/users/profile/upload-picture', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};