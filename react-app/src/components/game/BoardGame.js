import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

function BoardGame() {
  const [character, setCharacter] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const [boardState, setBoardState] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [logMessages, setLogMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    startGame();
  }, []);

  const startGame = async () => {
    setIsLoading(true);
    try {
      // Call the backend to start a board game
      const response = await api.get('/game/board_game');
      
      setCharacter(response.data.character);
      setGameResult(response.data.game_result);
      
      // Parse the game result to create the board
      parseGameResult(response.data.game_result);
      
    } catch (err) {
      console.error('Error starting board game:', err);
      setError('Une erreur est survenue lors du lancement du jeu de plateau.');
    } finally {
      setIsLoading(false);
    }
  };

  const parseGameResult = (resultText) => {
    // Split the result by lines
    const lines = resultText.split('\n');
    
    // Extract game events and create a board from them
    let board = [];
    let logs = [];
    let position = 0;
    let completed = false;
    let isOver = false;
    
    lines.forEach(line => {
      if (line.trim() === '') return;
      
      logs.push(line);
      
      // Parse position from lines like "Moving to position X"
      if (line.includes('Moving to position')) {
        const posMatch = line.match(/position (\d+)/);
        if (posMatch && posMatch[1]) {
          position = parseInt(posMatch[1], 10);
        }
      }
      
      // Parse events to create board cells
      if (line.includes('found a Monster')) {
        board.push({ type: 'monster', description: line });
      } else if (line.includes('found a potion')) {
        board.push({ type: 'potion', description: line });
      } else if (line.includes('found a weapon')) {
        board.push({ type: 'weapon', description: line });
      } else if (line.includes('empty space')) {
        board.push({ type: 'empty', description: 'Empty space' });
      }
      
      // Check for game completion or game over
      if (line.includes('completed the tableau')) {
        completed = true;
      }
      if (line.includes('Game Over')) {
        isOver = true;
      }
    });
    
    setBoardState(board);
    setLogMessages(logs);
    setCurrentPosition(position);
    setGameCompleted(completed);
    setGameOver(isOver);
  };

  const getCellClass = (index) => {
    if (index === currentPosition) {
      return 'current-cell';
    }
    if (!boardState[index]) return 'cell';
    
    switch(boardState[index].type) {
      case 'monster': return 'monster-cell';
      case 'potion': return 'potion-cell';
      case 'weapon': return 'weapon-cell';
      default: return 'empty-cell';
    }
  };

  const getCellIcon = (index) => {
    if (!boardState[index]) return '?';
    
    switch(boardState[index].type) {
      case 'monster': return '👹';
      case 'potion': return '🧪';
      case 'weapon': return '⚔️';
      default: return ' ';
    }
  };

  if (isLoading) {
    return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
        <button 
          className="btn btn-primary ms-3"
          onClick={() => navigate('/character-profile')}
        >
          Retour au profil
        </button>
      </div>
    );
  }

  return (
    <div className="board-game-container">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">Jeu de Plateau - {character?.name}</h2>
        </div>
        
        <div className="card-body">
          {/* Game Status */}
          <div className={`alert ${gameCompleted ? 'alert-success' : gameOver ? 'alert-danger' : 'alert-info'}`}>
            <h4>
              {gameCompleted ? 'Félicitations! Vous avez terminé le jeu!' : 
               gameOver ? 'Game Over! Votre personnage est mort.' :
               'Aventure en cours...'}
            </h4>
          </div>
          
          {/* Character Stats */}
          <div className="character-stats mb-4">
            <h3>Statistiques</h3>
            <div className="progress mb-2">
              <div 
                className="progress-bar bg-danger" 
                style={{ width: `${(character?.health / 100) * 100}%` }}
              >
                Vie: {character?.health}/100
              </div>
            </div>
            <div className="progress mb-2">
              <div 
                className="progress-bar bg-primary" 
                style={{ width: `${(character?.attack / 50) * 100}%` }}
              >
                Attaque: {character?.attack}
              </div>
            </div>
            <div className="progress mb-2">
              <div 
                className="progress-bar bg-success" 
                style={{ width: `${(character?.defense / 50) * 100}%` }}
              >
                Défense: {character?.defense}
              </div>
            </div>
          </div>
          
          {/* Game Board */}
          <div className="game-board mb-4">
            <h3>Plateau de jeu</h3>
            <div className="board-grid">
              {/* Generate a grid of cells based on boardState */}
              {[...Array(20)].map((_, index) => (
                <div 
                  key={index}
                  className={`board-cell ${getCellClass(index)}`}
                  title={boardState[index]?.description}
                >
                  {index === currentPosition ? '🧙' : getCellIcon(index)}
                  <div className="cell-number">{index+1}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Game Log */}
          <div className="game-log">
            <h3>Journal d'aventure</h3>
            <div className="card">
              <div className="card-body" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {logMessages.map((log, index) => (
                  <p key={index} className="mb-2">
                    {log}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="card-footer">
          <div className="d-flex justify-content-between">
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/character-profile')}
            >
              Retour au profil
            </button>
            
            {(gameOver || gameCompleted) && (
              <button 
                className="btn btn-primary"
                onClick={startGame}
              >
                Nouvelle partie
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoardGame;
