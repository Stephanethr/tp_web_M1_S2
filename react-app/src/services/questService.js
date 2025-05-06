import api from './api';

export const questService = {
  // Récupérer toutes les quêtes disponibles
  getQuests: async () => {
    try {
      const response = await api.get('/api/quests');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: "Une erreur est survenue lors de la récupération des quêtes" };
    }
  },
  
  // Récupérer une quête spécifique avec ses détails
  getQuestDetails: async (questId) => {
    try {
      const response = await api.get(`/api/quests/${questId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: "Une erreur est survenue lors de la récupération des détails de la quête" };
    }
  },
  
  // Accepter une quête
  acceptQuest: async (questId) => {
    try {
      const response = await api.post(`/api/quests/${questId}/accept`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: "Une erreur est survenue lors de l'acceptation de la quête" };
    }
  },
  
  // Abandonner une quête
  abandonQuest: async (questId) => {
    try {
      const response = await api.post(`/api/quests/${questId}/abandon`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: "Une erreur est survenue lors de l'abandon de la quête" };
    }
  },
  
  // Compléter une étape de quête
  completeQuestStep: async (questId, stepId) => {
    try {
      const response = await api.post(`/api/quests/${questId}/steps/${stepId}/complete`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: "Une erreur est survenue lors de la complétion de l'étape" };
    }
  },
  
  // Réclamer la récompense d'une quête
  claimReward: async (questId) => {
    try {
      const response = await api.post(`/api/quests/${questId}/claim`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: "Une erreur est survenue lors de la réclamation de la récompense" };
    }
  },
  
  // Récupérer les quêtes actives de l'utilisateur
  getActiveQuests: async () => {
    try {
      const response = await api.get('/api/quests/active');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: "Une erreur est survenue lors de la récupération des quêtes actives" };
    }
  },
  
  // Récupérer les quêtes complétées de l'utilisateur
  getCompletedQuests: async () => {
    try {
      const response = await api.get('/api/quests/completed');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: "Une erreur est survenue lors de la récupération des quêtes complétées" };
    }
  }
};

export default questService;