import { useContext } from 'react';
import { VersusContext } from '../context/VersusContext';

export const useCharacters = () => {
  const context = useContext(VersusContext);
  
  if (!context) {
    throw new Error('useCharacters must be used within a CharacterProvider');
  }
  
  return context;
};