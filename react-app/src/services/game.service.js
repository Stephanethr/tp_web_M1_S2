import api from './api';

/**
 * Service pour gérer les opérations liées au jeu
 */
class GameService {
  /**
   * Récupère la liste des quêtes disponibles
   * @returns {Promise} Liste des quêtes
   */
  async getQuests() {
    try {
      const response = await api.get('/game/quests');
      return response.data.quests || [];
    } catch (error) {
      console.error('Error fetching quests:', error);
      throw error;
    }
  }

  /**
   * Démarre une quête spécifique
   * @param {number} questId - ID de la quête
   * @returns {Promise} Résultat de la quête
   */
  async startQuest(questId) {
    const formData = new FormData();

    try {
      const response = await api.post(`/game/quest/${questId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.result;
    } catch (error) {
      console.error('Error starting quest:', error);
      throw error;
    }
  }

  /**
   * Lance un combat entre deux personnages
   * @param {number} player1Id - ID du premier personnage
   * @param {number} player2Id - ID du deuxième personnage
   * @returns {Promise} Résultat du combat
   */
  async startFight(player1Id, player2Id) {
    const formData = new FormData();
    formData.append('player1', player1Id);
    formData.append('player2', player2Id);

    try {
      const response = await api.post('/game/fight', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error starting fight:', error);
      throw error;
    }
  }

  /**
   * Lance une partie du jeu de plateau
   * @returns {Promise} Résultat de la partie
   */
  async startBoardGame() {
    try {
      const response = await api.get('/game/board_game');
      return response.data;
    } catch (error) {
      console.error('Error starting board game:', error);
      throw error;
    }
  }

  /**
   * Joue un tour dans le jeu de plateau
   * @returns {Promise} Résultat du tour
   */
  async playTurn() {
    try {
      const response = await api.post('/game/play_turn');
      return response.data.turn_result;
    } catch (error) {
      console.error('Error playing turn:', error);
      throw error;
    }
  }

  /**
   * Récupère les résultats d'un combat
   * @param {number} fightId - ID du combat (optionnel)
   * @returns {Promise} Résultats du combat
   */
  async getFightResult(fightId = null) {
    let url = '/game/fight_result';
    if (fightId) {
      url += `/${fightId}`;
    }

    try {
      const response = await api.get(url);
      return response.data.result;
    } catch (error) {
      console.error('Error fetching fight result:', error);
      throw error;
    }
  }

  /**
   * Récupère les récompenses après un combat ou une quête
   * @param {string} type - Type d'activité ('quest' ou 'fight')
   * @param {number} activityId - ID de l'activité
   * @returns {Promise} Récompenses obtenues
   */
  async claimRewards(type, activityId) {
    const formData = new FormData();
    formData.append('activity_type', type);
    formData.append('activity_id', activityId);

    try {
      const response = await api.post('/game/claim_rewards', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.rewards;
    } catch (error) {
      console.error('Error claiming rewards:', error);
      throw error;
    }
  }
}

export default new GameService();
