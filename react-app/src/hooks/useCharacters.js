// src/hooks/useCharacters.js
import { useContext } from 'react';
import { CharacterContext } from '../context/CharacterContext';

export const useCharacters = () => {
  const context = useContext(CharacterContext);
  
  if (!context) {
    throw new Error('useCharacters must be used within a CharacterProvider');
  }
  
  return context;
};