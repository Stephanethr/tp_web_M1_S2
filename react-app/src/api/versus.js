import API from './index';

export const getVersusFight = async (attackerId, defenderId) => {
    try {
        const response = await API.post('/game/versus/fight/', {
        player1: attackerId,
        player2: defenderId
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Erreur lors du démarrage du combat' };
    }
}

export const getVersusCharacters = async (battleId) => {
    try {
        const response = await API.get('/game/versus/');
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Erreur lors de la récupération du résultat du combat' };
    }
}