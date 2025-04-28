import React, { useState, useEffect, useCallback } from 'react';
import { startBoardGame } from '../api/apiService';

const BoardGame = () => {
  const [gameData, setGameData] = useState(null);
  const [gameState, setGameState] = useState({
    started: false,
    completed: false,
    gameOver: false,
    currentPosition: 0,
    logs: [],
    showDice: false,
    diceValue: null,
    currentTurn: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Charger les données initiales du jeu
  useEffect(() => {
    const fetchBoardGame = async () => {
      try {
        const data = await startBoardGame();
        if (data.success) {
          setGameData(data);
          // Initialiser l'état du jeu
          setGameState({
            ...gameState,
            started: false,
            logs: [`Bienvenue au jeu de plateau, ${data.character.name}!`]
          });
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Erreur lors du chargement du jeu');
      } finally {
        setLoading(false);
      }
    };

    fetchBoardGame();
  }, []);

  // Fonction pour lancer le dé
  const rollDice = useCallback(() => {
    // Valeur aléatoire entre 1 et 6
    const value = Math.floor(Math.random() * 6) + 1;
    
    setGameState(prevState => ({
      ...prevState,
      showDice: true,
      diceValue: value,
      logs: [...prevState.logs, `Vous avez lancé le dé : ${value}`]
    }));

    return value;
  }, []);

  // Fonction pour déplacer le joueur
  const movePlayer = useCallback((steps) => {
    setGameState(prevState => {
      const newPosition = Math.min(prevState.currentPosition + steps, gameData.board.length - 1);
      
      return {
        ...prevState,
        currentPosition: newPosition,
        logs: [...prevState.logs, `Déplacement vers la case ${newPosition + 1}`]
      };
    });
  }, [gameData]);

  // Fonction pour gérer les événements sur les cases
  const handleSquareEvent = useCallback(() => {
    if (!gameData) return;
    
    const currentSquare = gameData.board[gameState.currentPosition];

    // Logique spécifique en fonction du type de case
    let newLogs = [];
    let character = { ...gameData.character };
    let isGameOver = false;

    switch (currentSquare.type) {
      case 'monster':
        newLogs.push(`Vous rencontrez un monstre : ${currentSquare.name}!`);
        // Simulation simplifiée du combat
        if (character.attack > currentSquare.attack) {
          newLogs.push(`Vous avez vaincu ${currentSquare.name}!`);
          // Gain d'XP
          character.experience += 10;
          newLogs.push(`Vous gagnez 10 XP.`);
        } else {
          character.health -= 20;
          newLogs.push(`${currentSquare.name} vous inflige 20 dégâts!`);
          if (character.health <= 0) {
            newLogs.push(`Vous êtes mort! Game Over.`);
            isGameOver = true;
          }
        }
        break;
      
      case 'treasure':
        newLogs.push(`Vous trouvez un trésor : ${currentSquare.name}!`);
        if (currentSquare.gold) {
          character.gold = (character.gold || 0) + currentSquare.gold;
          newLogs.push(`Vous gagnez ${currentSquare.gold} pièces d'or.`);
        }
        if (currentSquare.item) {
          newLogs.push(`Vous obtenez un nouvel objet: ${currentSquare.item}`);
        }
        break;
      
      case 'trap':
        newLogs.push(`Vous tombez dans un piège : ${currentSquare.name}!`);
        character.health -= currentSquare.damage;
        newLogs.push(`Vous perdez ${currentSquare.damage} points de vie.`);
        if (character.health <= 0) {
          newLogs.push(`Vous êtes mort! Game Over.`);
          isGameOver = true;
        }
        break;
      
      case 'heal':
        newLogs.push(`Vous trouvez une source de guérison : ${currentSquare.name}!`);
        character.health = Math.min(100, character.health + currentSquare.value);
        newLogs.push(`Vous récupérez ${currentSquare.value} points de vie.`);
        break;
      
      case 'bonus':
        newLogs.push(`Bonus: ${currentSquare.description}!`);
        if (currentSquare.effect === 'extra_turn') {
          newLogs.push(`Vous gagnez un tour supplémentaire!`);
        }
        break;
      
      case 'end':
        newLogs.push(`Félicitations! Vous avez atteint la fin du plateau.`);
        return {
          ...gameState,
          logs: [...gameState.logs, ...newLogs],
          completed: true
        };
      
      default:
        newLogs.push(`Vous arrivez sur une case normale.`);
        break;
    }

    return {
      ...gameState,
      logs: [...gameState.logs, ...newLogs],
      currentTurn: gameState.currentTurn + 1,
      gameOver: isGameOver
    };
  }, [gameData, gameState]);

  // Fonction pour jouer un tour complet
  const playTurn = useCallback(() => {
    // Si le jeu est terminé ou game over, ne rien faire
    if (gameState.completed || gameState.gameOver) return;
    
    // Lancer le dé
    const diceValue = rollDice();
    
    // Attendre un peu pour montrer la valeur du dé
    setTimeout(() => {
      // Déplacer le joueur
      movePlayer(diceValue);
      
      // Attendre que le déplacement soit effectué
      setTimeout(() => {
        // Gérer l'événement sur la case
        handleSquareEvent();
      }, 1000);
    }, 1000);
  }, [rollDice, movePlayer, handleSquareEvent, gameState.completed, gameState.gameOver]);

  // Fonction pour commencer le jeu
  const startGame = () => {
    setGameState(prevState => ({
      ...prevState,
      started: true,
      logs: [...prevState.logs, 'Le jeu commence!']
    }));
  };

  // Rendu des cases du plateau
  const renderBoard = () => {
    if (!gameData || !gameData.board) return null;

    // Déterminer une disposition en serpent pour le plateau
    const gridSize = Math.ceil(Math.sqrt(gameData.board.length));
    const rows = [];

    for (let i = 0; i < gridSize; i++) {
      const row = [];
      const isReversed = i % 2 === 1; // Alterne la direction pour créer un serpent
      
      for (let j = 0; j < gridSize; j++) {
        const index = isReversed 
          ? i * gridSize + (gridSize - j - 1) // Inversé pour les lignes impaires
          : i * gridSize + j;                 // Normal pour les lignes paires
        
        if (index < gameData.board.length) {
          const square = gameData.board[index];
          const isCurrentPosition = gameState.currentPosition === index;
          
          // Déterminez la couleur de la case en fonction de son type
          let bgColor = 'bg-gray-200 dark:bg-gray-700';
          
          switch (square.type) {
            case 'monster':
              bgColor = 'bg-red-200 dark:bg-red-900';
              break;
            case 'treasure':
              bgColor = 'bg-yellow-200 dark:bg-yellow-900';
              break;
            case 'trap':
              bgColor = 'bg-purple-200 dark:bg-purple-900';
              break;
            case 'heal':
              bgColor = 'bg-green-200 dark:bg-green-900';
              break;
            case 'bonus':
              bgColor = 'bg-blue-200 dark:bg-blue-900';
              break;
            case 'end':
              bgColor = 'bg-pink-200 dark:bg-pink-900';
              break;
            default:
              break;
          }

          row.push(
            <div 
              key={index}
              className={`
                w-16 h-16 md:w-20 md:h-20 flex flex-col justify-center items-center
                ${bgColor}
                ${isCurrentPosition ? 'ring-4 ring-accent' : ''}
                rounded-lg shadow text-center text-xs p-1
              `}
            >
              <div>{index + 1}</div>
              {isCurrentPosition && (
                <div className="w-6 h-6 bg-accent rounded-full flex justify-center items-center text-white font-bold">
                  {gameData.character.name.charAt(0)}
                </div>
              )}
            </div>
          );
        } else {
          // Case vide pour compléter la grille
          row.push(
            <div 
              key={`empty-${index}`}
              className="w-16 h-16 md:w-20 md:h-20 bg-transparent"
            />
          );
        }
      }
      rows.push(
        <div key={i} className="flex justify-center">
          {row}
        </div>
      );
    }

    return (
      <div className="grid gap-2 mb-6">
        {rows}
      </div>
    );
  };

  // Rendu du dé
  const renderDice = () => {
    if (!gameState.showDice) return null;

    // Configuration des points sur le dé en fonction de la valeur
    const dotPositions = {
      1: ['center'],
      2: ['top-left', 'bottom-right'],
      3: ['top-left', 'center', 'bottom-right'],
      4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
      6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right']
    };

    const dots = dotPositions[gameState.diceValue].map((pos, idx) => {
      let className = "absolute w-3 h-3 bg-black dark:bg-white rounded-full";
      
      switch (pos) {
        case 'top-left':
          className += " top-2 left-2";
          break;
        case 'top-right':
          className += " top-2 right-2";
          break;
        case 'middle-left':
          className += " top-1/2 left-2 -translate-y-1/2";
          break;
        case 'center':
          className += " top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
          break;
        case 'middle-right':
          className += " top-1/2 right-2 -translate-y-1/2";
          break;
        case 'bottom-left':
          className += " bottom-2 left-2";
          break;
        case 'bottom-right':
          className += " bottom-2 right-2";
          break;
        default:
          break;
      }

      return <div key={idx} className={className}></div>;
    });

    return (
      <div className="w-16 h-16 bg-white dark:bg-gray-300 rounded-lg shadow-lg relative">
        {dots}
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-10">Chargement du jeu de plateau...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      </div>
    );
  }

  if (!gameData) {
    return (
      <div className="text-center py-10">
        Une erreur s'est produite lors du chargement du jeu.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Jeu de Plateau : L'Aventure de {gameData.character.name}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tableau de bord du personnage */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Votre personnage</h2>
          
          <div className="mb-4">
            <h3 className="text-lg">{gameData.character.name}</h3>
            <p className="text-sm text-gray-600">
              {gameData.character.race} {gameData.character.class} - Niveau {gameData.character.level}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div>
              <p className="text-sm text-gray-600">Points de vie</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div 
                  className="bg-red-600 h-2.5 rounded-full" 
                  style={{
                    width: `${Math.max(0, Math.min(100, gameData.character.health))}%`
                  }}
                ></div>
              </div>
              <p className="text-sm mt-1">{gameData.character.health}/100</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Expérience</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{
                    width: `${(gameData.character.experience % 100)}%`
                  }}
                ></div>
              </div>
              <p className="text-sm mt-1">{gameData.character.experience % 100}/100</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Attaque</p>
              <p className="font-medium">{gameData.character.attack}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Défense</p>
              <p className="font-medium">{gameData.character.defense}</p>
            </div>
            {gameData.character.gold !== undefined && (
              <div>
                <p className="text-sm text-gray-600">Or</p>
                <p className="font-medium">{gameData.character.gold} pièces</p>
              </div>
            )}
          </div>

          {/* Dé et bouton pour jouer */}
          <div className="flex flex-col items-center">
            {gameState.showDice && renderDice()}
            
            {!gameState.started ? (
              <button
                onClick={startGame}
                className="btn btn-primary mt-4 w-full"
              >
                Commencer le jeu
              </button>
            ) : (
              <button
                onClick={playTurn}
                className="btn btn-primary mt-4 w-full"
                disabled={gameState.completed || gameState.gameOver}
              >
                {gameState.completed 
                  ? "Jeu terminé" 
                  : gameState.gameOver 
                    ? "Game Over" 
                    : "Lancer le dé"
                }
              </button>
            )}
          </div>
        </div>

        {/* Plateau de jeu */}
        <div className="lg:col-span-2 card flex flex-col items-center justify-center overflow-auto">
          <div className="overflow-auto p-2">
            {renderBoard()}
          </div>
        </div>

        {/* Journal de jeu */}
        <div className="lg:col-span-3 card">
          <h2 className="text-xl font-semibold mb-3">Journal de jeu</h2>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-60 overflow-y-auto">
            {gameState.logs.map((log, index) => (
              <div key={index} className="mb-2 last:mb-0 text-sm">
                <span className="text-gray-500">[Tour {Math.floor(index/3)}]</span> {log}
              </div>
            ))}
            {gameState.logs.length === 0 && (
              <p className="text-gray-500 italic">Le journal est vide. Commencez le jeu pour voir les événements.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardGame;
