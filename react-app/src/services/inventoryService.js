import api from './api';

const inventoryService = {
  // Récupérer l'inventaire du personnage actif
  getInventory: async (params = {}) => {
    try {
      const response = await api.get('/inventory/', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Ajouter un nouvel item à l'inventaire
  addItem: async (itemData) => {
    try {
      const response = await api.post('/inventory/', itemData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour un item existant
  updateItem: async (id, itemData) => {
    try {
      const response = await api.put(`/inventory/${id}`, itemData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer un item de l'inventaire
  deleteItem: async (id) => {
    try {
      const response = await api.delete(`/inventory/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Utiliser un item (consommer)
  useItem: async (id) => {
    try {
      const response = await api.post(`/inventory/${id}/use`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer les types d'objets disponibles
  getItemTypes: async () => {
    try {
      const response = await api.get('/items');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Équiper un objet
  equipItem: async (itemId, slot) => {
    try {
      const response = await api.post(`/api/inventory/${itemId}/equip`, { slot });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Déséquiper un objet
  unequipItem: async (itemId) => {
    try {
      const response = await api.post(`/api/inventory/${itemId}/unequip`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

};

export default inventoryService;
