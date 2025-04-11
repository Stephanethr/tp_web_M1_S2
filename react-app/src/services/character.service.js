import api from './api';

/**
 * Service pour gérer les opérations liées aux personnages
 */
class CharacterService {
  /**
   * Récupère tous les personnages de l'utilisateur
   * @returns {Promise} Liste des personnages
   */
  async getAllCharacters() {
    try {
      const response = await api.get('/game/characters');
      return response.data.characters || [];
    } catch (error) {
      console.error('Error fetching characters:', error);
      throw error;
    }
  }

  /**
   * Récupère les détails d'un personnage
   * @param {number} characterId - ID du personnage
   * @returns {Promise} Détails du personnage
   */
  async getCharacterProfile(characterId = null) {
    let url = '/game/character_profile';
    if (characterId) {
      url += `/${characterId}`;
    }

    try {
      const response = await api.get(url);
      return response.data.character;
    } catch (error) {
      console.error('Error fetching character profile:', error);
      throw error;
    }
  }

  /**
   * Crée un nouveau personnage
   * @param {string} name - Nom du personnage
   * @param {string} race - Race du personnage (HUMAN, ELF, DWARF, ORC)
   * @param {string} characterClass - Classe du personnage (warrior, mage)
   * @returns {Promise} Résultat de la création
   */
  async createCharacter(name, race, characterClass) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('race', race);
    formData.append('class', characterClass);

    try {
      const response = await api.post('/game/create_character', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating character:', error);
      throw error;
    }
  }

  /**
   * Sélectionne un personnage comme actif
   * @param {number} characterId - ID du personnage à sélectionner
   * @returns {Promise} Résultat de la sélection
   */
  async selectCharacter(characterId) {
    const formData = new FormData();

    try {
      const response = await api.post(`/game/select_character/${characterId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error selecting character:', error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques d'un personnage
   * @param {number} characterId - ID du personnage
   * @returns {Promise} Statistiques du personnage
   */
  async getCharacterStats(characterId) {
    try {
      const response = await api.get(`/game/character_stats/${characterId}`);
      return response.data.stats;
    } catch (error) {
      console.error('Error fetching character stats:', error);
      throw error;
    }
  }
}

export default new CharacterService();