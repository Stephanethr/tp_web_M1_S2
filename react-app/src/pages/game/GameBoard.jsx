import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { useCharacter } from '../../context/CharacterContext';
import API from '../../api/index';

const GameBoard = () => {
  const { boardSession, initBoardGame } = useGame();
  const { activeCharacter } = useCharacter();
  const [board, setBoard] = useState([]);

  useEffect(() => {
    if (activeCharacter && !boardSession) {
      initBoardGame(activeCharacter.id);
    }
  }, [activeCharacter]);

  useEffect(() => {
    const fetchBoard = async () => {
      if (boardSession) {
        try {
          const response = await API.get(`/game/board/${boardSession.id}/`);
          setBoard(response.data.board);
        } catch (error) {
          console.error('Erreur chargement plateau:', error);
        }
      }
    };
    fetchBoard();
  }, [boardSession]);

  const handleCellClick = async (x, y) => {
    try {
      await API.post(`/game/board/${boardSession.id}/play/`, {
        x,
        y,
        action: 'move'
      });
      // Recharger l'état du plateau après l'action
      const response = await API.get(`/game/board/${boardSession.id}/`);
      setBoard(response.data.board);
    } catch (error) {
      console.error('Erreur action:', error);
    }
  };

  return (
    <div className="board-game bg-gray-100 p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Jeu de Plateau - Tour {boardSession?.current_turn}</h2>
      <div className="grid grid-cols-5 gap-2">
        {board.map((row, y) => row.map((cell, x) => (
          <button
            key={`${x}-${y}`}
            onClick={() => handleCellClick(x, y)}
            className={`cell h-16 w-16 rounded ${
              cell === 'player' ? 'bg-blue-500' :
              cell === 'enemy' ? 'bg-red-500' :
              cell === 'obstacle' ? 'bg-gray-400' :
              'bg-white hover:bg-gray-200'
            }`}
            disabled={cell !== 'empty'}
          />
        )))}
      </div>
    </div>
  );
};

export default GameBoard;