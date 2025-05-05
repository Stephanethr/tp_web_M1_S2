import { useContext } from 'react';
import { GameContext } from '../contexts/GameContext';

const useCharacter = () => {
  const context = useContext(GameContext);
  
  if (context === undefined) {
    throw new Error('useCharacter must be used within a GameProvider');
  }
  
  return context;
};

export default useCharacter;
