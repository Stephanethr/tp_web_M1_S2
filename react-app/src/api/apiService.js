import axios from 'axios';

// Configuration d'axios avec l'URL de base de l'API
const API = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true // Pour permettre l'envoi de cookies pour l'authentification
});

// Intercepteur pour gérer les erreurs globalement
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Rediriger vers la page de connexion si non authentifié
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const logout = async () => {
  try {
    const response = await API.post('/logout');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
};

export const checkAuth = async () => {
  try {
    const response = await API.get('/check_auth');
    return response.data;
  } catch (error) {
    return { success: false };
  }
};

// Services pour les personnages
export const getCharacterProfile = async () => {
  try {
    const response = await API.get('/game/character_profile');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
};

export const getCharacterList = async () => {
  try {
    const response = await API.get('/game/characters');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
};

export const createCharacter = async (name, race, characterClass) => {
  try {
    const response = await API.post('/game/create_character', {
      name,
      race,
      class: characterClass
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
};

export const selectCharacter = async (characterId) => {
  try {
    const response = await API.post(`/game/select_character/${characterId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
};

// Services pour l'inventaire
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

export const addItem = async (name, typeId, quantity) => {
  try {
    const response = await API.post('/add_item', { 
      name, 
      type_id: typeId, 
      quantity 
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
};

export const editItem = async (itemId, name, typeId, quantity) => {
  try {
    const response = await API.post(`/edit/${itemId}`, {
      name,
      type_id: typeId,
      quantity
    });
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

// Services pour le mode Versus
export const getVersusMode = async () => {
  try {
    const response = await API.get('/game/versus');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
};

export const startBattle = async (player1Id, player2Id) => {
  try {
    const response = await API.post('/game/fight', {
      player1: player1Id,
      player2: player2Id
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
};

// Services pour les quêtes
export const getQuests = async () => {
  try {
    const response = await API.get('/game/quests');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
};

export const startQuest = async (questId) => {
  try {
    const response = await API.post(`/game/quest/${questId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
};

// Service pour le jeu de plateau
export const getBoardGame = async () => {
  try {
    const response = await API.get('/game/board_game');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
};

export const playTurn = async (gameId) => {
  try {
    const response = await API.post(`/game/board_game/play_turn`, { game_id: gameId });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
};

// Fonction utilitaire pour vérifier l'authentification
export const isAuthenticated = async () => {
  try {
    const response = await checkAuth();
    return response.success;
  } catch (error) {
    return false;
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

// Fonction pour récupérer les types d'objets disponibles
export const getItemTypes = async () => {
  try {
    const response = await API.get('/item_types');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
};

// Fonction pour récupérer les détails d'un objet spécifique
export const getItemDetails = async (itemId) => {
  try {
    const response = await API.get(`/item/${itemId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
};

// Fonction pour récupérer les détails d'une quête
export const getQuestDetails = async (questId) => {
  try {
    const response = await API.get(`/game/quest/${questId}/details`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
};

// Récupérer la liste des personnages de l'utilisateur
export const getCharacters = async () => {
  try {
    const response = await API.get('/game/characters');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des personnages:', error);
    throw error;
  }
};

// Démarrer un combat entre deux personnages
export const startFight = async (player1Id, player2Id) => {
  try {
    const response = await API.post('/game/fight', {
      player1: player1Id,
      player2: player2Id
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors du démarrage du combat:', error);
    throw error;
  }
};

// Démarrer une partie du jeu de plateau
export const startBoardGame = async () => {
  try {
    const response = await API.get('/game/board_game');
    return response.data;
  } catch (error) {
    console.error('Erreur lors du démarrage du jeu de plateau:', error);
    throw error;
  }
};


