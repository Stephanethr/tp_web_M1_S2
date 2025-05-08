import API from './index';

export const inventoryAPI = {
  getInventory: async () => {
    const response = await API.get('/inventory/');
    return response.data;
  },

  toggleItem: async (itemId, slot, isEquipping) => {
    const method = isEquipping ? 'post' : 'delete';
    return API[method](`/inventory/${itemId}/equip/`, { slot });
  },

  deleteItem: async (itemId, source) => {
    return API.delete(`/inventory/${itemId}/`, { params: { source } });
  },

  useItem: async (itemId) => {
    return API.post(`/inventory/${itemId}/consume/`);
  }
};