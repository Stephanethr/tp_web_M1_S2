import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/index'; // Assurez-vous que le chemin est correct

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [currentBattle, setCurrentBattle] = useState(null);
  const [boardSession, setBoardSession] = useState(null);
  const [activeQuests, setActiveQuests] = useState([]);
  
  // Mode Versus : Combat entre personnages
  const startVersusBattle = async (character1Id, character2Id) => {
    try {
      const response = await API.post('/game/versus/start/', {
        attacker_id: character1Id,
        defender_id: character2Id
      });
      setCurrentBattle(response.data);
    } catch (error) {
      console.error('Erreur démarrage combat:', error);
      throw error;
    }
  };

  // Mode Plateau : Initialiser une session
  const initBoardGame = async (characterId) => {
    try {
      const response = await API  .post('/game/board/start/', {
        character_id: characterId
      });
      setBoardSession(response.data);
    } catch (error) {
      console.error('Erreur initialisation plateau:', error);
      throw error;
    }
  };

  return (
    <GameContext.Provider value={{
      currentBattle,
      boardSession,
      activeQuests,
      startVersusBattle,
      initBoardGame
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);