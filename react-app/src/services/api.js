import axios from 'axios';

const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  response => response,
  error => {
    const { response } = error;
    
    if (response && response.status === 401) {
      // Rediriger vers la page de connexion si non autorisé
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;
