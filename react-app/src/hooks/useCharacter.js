import { useCallback, useState } from 'react';
import apiService from '../services/apiService';

const useCharacter = () => {
  const [characters, setCharacters] = useState([]);
  const [activeCharacter, setActiveCharacter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCharacters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getCharacters();
      if (response.success) {
        setCharacters(response.characters || []);
        // Find active character if any
        const active = response.characters?.find(char => char.isActive) || null;
        setActiveCharacter(active);
      } else {
        setError(response.message || 'Failed to load characters');
      }
    } catch (err) {
      console.error('Error fetching characters:', err);
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const getCharacterById = useCallback(async (characterId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getCharacter(characterId);
      if (response.success) {
        return response.character;
      } else {
        setError(response.message || 'Failed to load character');
        return null;
      }
    } catch (err) {
      console.error('Error fetching character:', err);
      setError(err.response?.data?.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCharacter = useCallback(async (characterData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.createCharacter(characterData);
      if (response.success) {
        return true;
      } else {
        setError(response.message || 'Failed to create character');
        return false;
      }
    } catch (err) {
      console.error('Error creating character:', err);
      setError(err.response?.data?.message || 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const selectCharacter = useCallback(async (characterId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.selectCharacter(characterId);
      if (response.success) {
        // Update active character
        const updatedChar = characters.find(char => char.id === characterId);
        if (updatedChar) {
          // Set this character as active and others as inactive
          const updatedCharacters = characters.map(char => ({
            ...char,
            isActive: char.id === characterId
          }));
          setCharacters(updatedCharacters);
          setActiveCharacter({...updatedChar, isActive: true});
        }
        return true;
      } else {
        setError(response.message || 'Failed to select character');
        return false;
      }
    } catch (err) {
      console.error('Error selecting character:', err);
      setError(err.response?.data?.message || 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, [characters]);

  return {
    characters,
    activeCharacter,
    loading,
    error,
    getCharacters,
    getCharacterById,
    createCharacter,
    selectCharacter
  };
};

export default useCharacter;