import { createContext, useContext, useState, useCallback } from 'react';
import { getVersusFight, getVersusCharacters } from '../api/versus';

const VersusContext = createContext();

export const VersusProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [characters, setCharacters] = useState([]);
  let [currentBattle, setCurrentBattle] = useState();

  const fetchAvailableCharacters = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getVersusCharacters();
      setCharacters(data.characters);
      setError(null);
    } catch (err) {
      setError(err.error || 'Erreur de chargement des personnages');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startBattle = useCallback(async (attackerId, defenderId) => {
    try {
      setIsLoading(true);
      const battleData = await getVersusFight(attackerId, defenderId);
      setCurrentBattle(battleData);
      setError(null);
      return battleData;
    } catch (err) {
      setError(err.error || 'Erreur de démarrage du combat');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    isLoading,
    error,
    characters,
    currentBattle,
    fetchAvailableCharacters,
    startBattle,
    resetBattle: () => setCurrentBattle(null)
  };

  return (
    <VersusContext.Provider value={value}>
      {children}
    </VersusContext.Provider>
  );
};

export const useVersus = () => useContext(VersusContext);