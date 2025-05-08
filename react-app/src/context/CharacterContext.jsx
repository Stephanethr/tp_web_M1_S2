// src/context/CharacterContext.jsx
import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
//import { useNavigate } from 'react-router-dom';
import { 
  getAllCharacters, 
  getCharacterById, 
  selectActiveCharacter, 
  createCharacter, 
  deleteCharacter,
  haveActiveCharacter
} from '../api/characters';
import { useAuth } from '../hooks/useAuth';

export const CharacterContext = createContext();

export const CharacterProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [characters, setCharacters] = useState([]);
  const [activeCharacter, setActiveCharacter] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger tous les personnages de l'utilisateur
  const loadCharacters = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      const data = await getAllCharacters();
      
      
      setCharacters(data.characters || []);
      
      setActiveCharacter(data.characters.find(character => character.is_active === true));

      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des personnages:', err);
      setError(err.error || 'Erreur lors du chargement des personnages');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Sélectionner un personnage comme actif
  const selectCharacter = useCallback(async (characterId) => {
    try {
      setIsLoading(true);
      await selectActiveCharacter(characterId);
      
      // Recharger les personnages pour obtenir les données à jour
      await loadCharacters();
    } catch (err) {
      console.error('Erreur lors de la sélection du personnage:', err);
      setError(err.error || 'Erreur lors de la sélection du personnage');
    } finally {
      setIsLoading(false);
    }
  }, [loadCharacters]);

  // Charger un personnage spécifique par son ID
  const loadCharacterDetails = useCallback(async (characterId) => {
    try {
      setIsLoading(true);
      const data = await getCharacterById(characterId);
      return data.character;
    } catch (err) {
      console.error('Erreur lors du chargement des détails du personnage:', err);
      setError(err.error || 'Erreur lors du chargement des détails du personnage');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Créer un nouveau personnage
  const createNewCharacter = useCallback(async (characterData) => {
    try {
      setIsLoading(true);
      const response = await createCharacter(characterData);
      
      // Recharger les personnages après la création
      await loadCharacters();
      
      return response;
    } catch (err) {
      console.error('Erreur lors de la création du personnage:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loadCharacters]);

  // Supprimer un personnage
  const removeCharacter = useCallback(async (characterId) => {
    try {
      setIsLoading(true);
      await deleteCharacter(characterId);
      
      // Recharger les personnages après la suppression
      await loadCharacters();
    } catch (err) {
      console.error('Erreur lors de la suppression du personnage:', err);
      setError(err.error || 'Erreur lors de la suppression du personnage');
    } finally {
      setIsLoading(false);
    }
  }, [loadCharacters]);

  const checkActiveCharacter = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await haveActiveCharacter();
      return data.active;
    } catch (err) {
      console.error('Erreur lors de la récupération du personnage actif:', err);
      setError(err.error || 'Erreur lors de la récupération du personnage actif');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [loadCharacters]);

  // Charger les personnages au montage du composant ou quand l'authentification change
  useEffect(() => {
    if (isAuthenticated) {
      loadCharacters();
    }
  }, [isAuthenticated, loadCharacters]);

  // Valeurs exposées par le contexte
  const value = {
    characters,
    activeCharacter,
    isLoading,
    error,
    loadCharacters,
    selectCharacter,
    loadCharacterDetails,
    createCharacter: createNewCharacter,
    deleteCharacter: removeCharacter,
    checkActiveCharacter,
  };

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => useContext(CharacterContext);