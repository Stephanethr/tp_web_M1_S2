// src/api/auth.js
import API from './index';

export const registerUser = async (userData) => {
  try {
    const response = await API.post('/auth/register/', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Une erreur est survenue' };
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await API.post('/auth/login/', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Une erreur est survenue' };
  }
};

export const getUserInfo = async () => {
  try {
    const response = await API.get('/auth/user/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Une erreur est survenue' };
  }
};