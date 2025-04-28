// Fonctions pour l'inventaire
export const getInventory = async (sortBy = 'item_name', order = 'asc') => {
  try {
    const response = await API.get(`/inventory?sort_by=${sortBy}&order=${order}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
};

export const addItem = async (itemData) => {
  try {
    const response = await API.post('/add_item', itemData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
};

export const editItem = async (itemId, itemData) => {
  try {
    const response = await API.post(`/edit/${itemId}`, itemData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
};

export const deleteItem = async (itemId) => {
  try {
    const response = await API.post(`/delete/${itemId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
};

export const consumeItem = async (itemId) => {
  try {
    const response = await API.post(`/consume/${itemId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
};

// Fonction pour obtenir les informations du personnage actif
export const getCharacterInfo = async () => {
  try {
    const response = await API.get('/game/character_profile');
    return response.data.character;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Aucun personnage actif
      return null;
    }
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
};

// Fonction d'enregistrement (inscription)
export const register = async (userData) => {
  try {
    const response = await API.post('/register', userData);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    if (error.response && error.response.data) {
      return {
        success: false,
        errors: error.response.data
      };
    }
    throw error;
  }
};

// Cette fonction login était peut-être déjà présente
export const login = async (email, password) => {
  try {
    const response = await API.post('/login', { email, password });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    if (error.response && error.response.data) {
      return {
        success: false,
        errors: error.response.data
      };
    }
    throw error;
  }
};