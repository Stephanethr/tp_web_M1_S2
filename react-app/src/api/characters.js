// src/api/characters.js
import API from './index';

// Récupérer tous les personnages de l'utilisateur
export const getAllCharacters = async () => {
  try {
    const response = await API.get('/characters/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Erreur lors de la récupération des personnages' };
  }
};

// Récupérer les détails d'un personnage spécifique
export const getCharacterById = async (characterId) => {
  try {
    const response = await API.get(`/characters/${characterId}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Erreur lors de la récupération du personnage' };
  }
};

// Créer un nouveau personnage
export const createCharacter = async (characterData) => {
  try {
    const response = await API.post('/characters/', characterData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Erreur lors de la création du personnage' };
  }
};

// Sélectionner un personnage comme actif
export const selectActiveCharacter = async (characterId) => {
  try {
    const response = await API.post(`/characters/${characterId}/select/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Erreur lors de la sélection du personnage' };
  }
};

// Supprimer un personnage
export const deleteCharacter = async (characterId) => {
  try {
    const response = await API.delete(`/characters/${characterId}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Erreur lors de la suppression du personnage' };
  }
};