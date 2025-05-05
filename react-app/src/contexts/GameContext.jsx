import React, { createContext, useState, useCallback, useEffect } from 'react';
import apiService from '../services/apiService';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [characters, setCharacters] = useState([]);
  const [activeCharacter, setActiveCharacter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Récupérer les personnages de l'utilisateur
  const getCharacters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getCharacters();
      setCharacters(response.data);
      
      // Si un personnage est actif, définissez-le
      const active = response.data.find(char => char.is_active);
      if (active) {
        setActiveCharacter(active);
      }
      
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to load characters');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Récupérer un personnage par ID
  const getCharacterById = useCallback(async (characterId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getCharacterById(characterId);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to load character');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Créer un nouveau personnage
  const createCharacter = useCallback(async (characterData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.createCharacter(characterData);
      // Mettre à jour la liste des personnages
      await getCharacters();
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to create character');
      return null;
    } finally {
      setLoading(false);
    }
  }, [getCharacters]);

  // Sélectionner un personnage comme actif
  const selectCharacter = useCallback(async (characterId) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.selectCharacter(characterId);
      
      // Mettre à jour le personnage actif et la liste des personnages
      const updatedCharacters = characters.map(char => ({
        ...char,
        is_active: char.id === characterId
      }));
      
      setCharacters(updatedCharacters);
      setActiveCharacter(updatedCharacters.find(char => char.id === characterId));
      
      return true;
    } catch (err) {
      setError(err.message || 'Failed to select character');
      return false;
    } finally {
      setLoading(false);
    }
  }, [characters]);

  // Initialisation: Charger les personnages au démarrage
  useEffect(() => {
    getCharacters();
  }, [getCharacters]);

  // Valeur du contexte
  const contextValue = {
    characters,
    activeCharacter,
    loading,
    error,
    getCharacters,
    getCharacterById,
    createCharacter,
    selectCharacter
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};