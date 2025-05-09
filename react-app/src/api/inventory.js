import API from './index';

export const getInventory = async () => {
  try {
    const response = await API.get('/inventory/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Erreur lors de la récupération de l\'inventaire' };
  }
};

export const toggleItem = async (itemId, slot, isEquipping) => {
  try {
    const method = isEquipping ? 'post' : 'delete';
    const response = await API[method](`/inventory/${itemId}/equip/`, { slot });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Erreur lors de la modification de l\'équipement' };
  }
};

export const deleteItem = async (itemId, source) => {
  try {
    const response = await API.delete(`/inventory/${itemId}/`, { params: { source } });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Erreur lors de la suppression de l\'objet' };
  }
}

export const consumeItem = async (itemId) => {
  try {
    const response = await API.post(`/inventory/${itemId}/consume/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Erreur lors de l\'utilisation de l\'objet' };
  }
}