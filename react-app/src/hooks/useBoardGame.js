import { useState, useCallback } from 'react';
import apiService from '../services/apiService';

function useBoardGame() {
  const [gameState, setGameState] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Démarrer une nouvelle partie
  const startGame = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.startBoardGame();
      setGameState(response.data.tableau_game);
      setGameResult(response.data.game_result);
      return response.data;
    } catch (err) {
      setError('Failed to start board game: ' + (err.message || 'Unknown error'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Réinitialiser le jeu
  const resetGame = useCallback(() => {
    setGameState(null);
    setGameResult(null);
    setError(null);
  }, []);

  return {
    gameState,
    gameResult,
    loading,
    error,
    startGame,
    resetGame
  };
}

export default useBoardGame;