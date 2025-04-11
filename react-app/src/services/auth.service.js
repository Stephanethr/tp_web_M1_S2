import api from './api';

/**
 * Service pour gérer les opérations liées à l'authentification
 */
class AuthService {
  /**
   * Connecte un utilisateur
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe de l'utilisateur
   * @returns {Promise} Réponse de l'API
   */
  async login(email, password) {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      const response = await api.post('/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Si le backend renvoie un token, le stocker
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Inscrit un nouvel utilisateur
   * @param {string} email - Email de l'utilisateur
   * @param {string} username - Nom d'utilisateur
   * @param {string} password - Mot de passe de l'utilisateur
   * @param {string} recheckPassword - Confirmation du mot de passe
   * @returns {Promise} Réponse de l'API
   */
  async register(email, username, password, recheckPassword) {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('recheck_password', recheckPassword);

    try {
      const response = await api.post('/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Si le backend renvoie un token, le stocker
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Déconnecte l'utilisateur
   * @returns {Promise} Réponse de l'API
   */
  async logout() {
    try {
      const response = await api.post('/logout');
      
      // Supprimer le token du localStorage
      localStorage.removeItem('token');
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   * @returns {boolean} Vrai si l'utilisateur est authentifié
   */
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}

export default new AuthService();
