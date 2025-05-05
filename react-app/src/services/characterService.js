import api from './api';

const characterService = {
  // Récupérer tous les personnages de l'utilisateur
  getCharacters: async () => {
    try {
      const response = await api.get('/api/characters');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer un personnage spécifique
  getCharacter: async (id) => {
    try {
      const response = await api.get(`/api/characters/${id}`);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  // Créer un nouveau personnage
  createCharacter: async (characterData) => {
    try {
      const response = await api.post('/api/characters', characterData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Sélectionner un personnage actif
  setActiveCharacter: async (characterId) => {
    try {
      const response = await api.post(`/api/characters/${characterId}/active`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Récupérer les statistiques d'un personnage
  getCharacterStats: async (id) => {
    try {
      const response = await api.get(`/api/characters/${id}/stats`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getRaces: async () => {
    try {
      const response = await api.get('/api/races');
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

export default characterService;
