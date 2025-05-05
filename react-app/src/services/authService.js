import api from './api';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: "Une erreur est survenue" };
    }
  },
  
  register: async (username, email, password) => {
    try {
      const response = await api.post('/api/auth/register', { username, email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: "Une erreur est survenue" };
    }
  },
  
  logout: async () => {
    try {
      await api.post('/api/auth/logout');
      localStorage.removeItem('user');
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  },
  
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  }
};
