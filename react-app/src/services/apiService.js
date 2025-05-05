import axios from 'axios';

// Configuration de base pour axios
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Créer une instance axios avec la configuration par défaut
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important pour envoyer les cookies de session
});

// Intercepteur pour gérer les erreurs globalement
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Gérer les erreurs 401 (non authentifié)
    if (error.response && error.response.status === 401) {
      // Rediriger vers la page de login si nécessaire
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Service API principal
const apiService = {
  // Vérification de l'état du serveur
  healthCheck: async () => {
    try {
      const response = await axiosInstance.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  // ==================== AUTHENTIFICATION ====================
  
  // Obtenir les informations de l'utilisateur courant
  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get('/user/current');
      return response.data;
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw error;
    }
  },

  // Se connecter
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  // S'inscrire
  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  // Se déconnecter
  logout: async () => {
    try {
      const response = await axiosInstance.post('/auth/logout');
      return response.data;
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  },

  // ==================== PERSONNAGES ====================
  
  // Récupérer tous les personnages de l'utilisateur
  getCharacters: async () => {
    try {
      const response = await axiosInstance.get('/characters');
      return response.data;
    } catch (error) {
      console.error('Failed to get characters:', error);
      throw error;
    }
  },

  // Récupérer un personnage spécifique
  getCharacter: async (characterId) => {
    try {
      const response = await axiosInstance.get(`/characters/${characterId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get character ${characterId}:`, error);
      throw error;
    }
  },

  // Créer un nouveau personnage
  createCharacter: async (characterData) => {
    try {
      const response = await axiosInstance.post('/characters', characterData);
      return response.data;
    } catch (error) {
      console.error('Failed to create character:', error);
      throw error;
    }
  },

  // Sélectionner un personnage comme personnage actif
  selectCharacter: async (characterId) => {
    try {
      const response = await axiosInstance.post(`/characters/${characterId}/select`);
      return response.data;
    } catch (error) {
      console.error(`Failed to select character ${characterId}:`, error);
      throw error;
    }
  },

  // ==================== QUÊTES ====================
  
  // Récupérer toutes les quêtes disponibles
  getQuests: async () => {
    try {
      const response = await axiosInstance.get('/quests');
      return response.data;
    } catch (error) {
      console.error('Failed to get quests:', error);
      throw error;
    }
  },

  // Démarrer une quête pour le personnage actif
  startQuest: async (questId) => {
    try {
      const response = await axiosInstance.post(`/quests/${questId}/start`);
      return response.data;
    } catch (error) {
      console.error(`Failed to start quest ${questId}:`, error);
      throw error;
    }
  },

  // Récupérer les quêtes complétées par un personnage
  getCompletedQuests: async (characterId) => {
    try {
      const response = await axiosInstance.get(`/characters/${characterId}/completed_quests`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get completed quests for character ${characterId}:`, error);
      throw error;
    }
  },

  // ==================== INVENTAIRE ====================
  
  // Récupérer l'inventaire du personnage actif
  getInventory: async () => {
    try {
      const response = await axiosInstance.get('/inventory');
      return response.data;
    } catch (error) {
      console.error('Failed to get inventory:', error);
      throw error;
    }
  },

  // Ajouter un objet à l'inventaire
  addItem: async (itemData) => {
    try {
      const response = await axiosInstance.post('/inventory', itemData);
      return response.data;
    } catch (error) {
      console.error('Failed to add item:', error);
      throw error;
    }
  },

  // Mettre à jour un objet dans l'inventaire
  updateItem: async (itemId, itemData) => {
    try {
      const response = await axiosInstance.put(`/inventory/${itemId}`, itemData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update item ${itemId}:`, error);
      throw error;
    }
  },

  // Supprimer un objet de l'inventaire
  deleteItem: async (itemId) => {
    try {
      const response = await axiosInstance.delete(`/inventory/${itemId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete item ${itemId}:`, error);
      throw error;
    }
  },

  // Utiliser un objet
  useItem: async (itemId) => {
    try {
      const response = await axiosInstance.post(`/inventory/${itemId}/use`);
      return response.data;
    } catch (error) {
      console.error(`Failed to use item ${itemId}:`, error);
      throw error;
    }
  },

  // Récupérer tous les types d'objets disponibles
  getItemTypes: async () => {
    try {
      const response = await axiosInstance.get('/items');
      return response.data;
    } catch (error) {
      console.error('Failed to get item types:', error);
      throw error;
    }
  },

  // ==================== COMBATS ====================
  
  // Démarrer un combat entre deux personnages (PvP)
  startVersus: async (player1Id, player2Id) => {
    try {
      const response = await axiosInstance.post('/versus', {
        player1_id: player1Id,
        player2_id: player2Id
      });
      return response.data;
    } catch (error) {
      console.error('Failed to start versus battle:', error);
      throw error;
    }
  },

  // ==================== JEU DE PLATEAU ====================
  
  // Démarrer une partie sur le plateau de jeu
  startBoardGame: async () => {
    try {
      const response = await axiosInstance.post('/board_game/start');
      return response.data;
    } catch (error) {
      console.error('Failed to start board game:', error);
      throw error;
    }
  },

  // Effectuer un mouvement sur le plateau
  makeBoardMove: async (direction) => {
    try {
      const response = await axiosInstance.post('/board_game/move', { direction });
      return response.data;
    } catch (error) {
      console.error(`Failed to make move ${direction}:`, error);
      throw error;
    }
  },

  // ==================== STATISTIQUES ====================
  
  // Récupérer les statistiques d'un personnage
  getCharacterStats: async (characterId) => {
    try {
      const response = await axiosInstance.get(`/characters/${characterId}/stats`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get statistics for character ${characterId}:`, error);
      throw error;
    }
  },
};

export default apiService;
