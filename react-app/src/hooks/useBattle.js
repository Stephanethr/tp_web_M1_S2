import { useState, useCallback } from 'react';
import apiService from '../services/apiService';

function useBattle() {
  const [battleResults, setBattleResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Démarrer un combat entre deux personnages
  const startBattle = useCallback(async (player1Id, player2Id) => {
    setLoading(true);
    setError(null);
    setBattleResults(null);
    
    try {
      const response = await apiService.startBattle(player1Id, player2Id);
      setBattleResults(response.data);
      return response.data;
    } catch (err) {
      setError('Failed to start battle: ' + (err.message || 'Unknown error'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Réinitialiser l'état des combats
  const resetBattle = useCallback(() => {
    setBattleResults(null);
    setError(null);
  }, []);

  return {
    battleResults,
    loading,
    error,
    startBattle,
    resetBattle
  };
}

export default useBattle;