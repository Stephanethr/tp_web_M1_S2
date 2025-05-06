import api from './api';

export const inventoryService = {
  getInventory: async () => {
    try {
      const response = await api.get('/inv/api/inventory');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: "Une erreur est survenue lors de la récupération de l'inventaire" };
    }
  },
  
  addItem: async (itemData) => {
    try {
      const response = await api.post('/inv/api/inventory', itemData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: "Une erreur est survenue lors de l'ajout de l'objet" };
    }
  },
  
  updateItem: async (id, itemData) => {
    try {
      const response = await api.put(`/inv/api/inventory/${id}`, itemData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: "Une erreur est survenue lors de la modification de l'objet" };
    }
  },
  
  deleteItem: async (id) => {
    try {
      const response = await api.delete(`/inv/api/inventory/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: "Une erreur est survenue lors de la suppression de l'objet" };
    }
  },
  
  useItem: async (id) => {
    try {
      const response = await api.post(`/inv/api/inventory/${id}/use`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: "Une erreur est survenue lors de l'utilisation de l'objet" };
    }
  },
  
  getItemTypes: async () => {
    try {
      const response = await api.get('/inv/api/items');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: "Une erreur est survenue lors de la récupération des types d'objets" };
    }
  },
};

export default inventoryService;
