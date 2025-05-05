import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useBoardGame from '../hooks/useBoardGame';
import useCharacter from '../hooks/useCharacter';
import GameBoard from '../components/board/GameBoard';
import GameStatus from '../components/board/GameStatus';
import GameResult from '../components/board/GameResult';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

function BoardGamePage() {
  const { gameState, gameResult, loading, error, startGame, resetGame } = useBoardGame();
  const { activeCharacter, loading: characterLoading, error: characterError } = useCharacter();
  const [isGameStarted, setIsGameStarted] = useState(false);
  
  const navigate = useNavigate();

  // Vérifier si un personnage actif est disponible
  useEffect(() => {
    if (!characterLoading && !activeCharacter && !error) {
      // Rediriger si aucun personnage actif n'est sélectionné
      // Cette logique peut être ajustée selon vos besoins
    }
  }, [characterLoading, activeCharacter, error, navigate]);

  // Fonction pour démarrer une nouvelle partie
  const handleStartGame = async () => {
    setIsGameStarted(true);
    await startGame();
  };

  // Fonction pour rejouer
  const handlePlayAgain = () => {
    resetGame();
    handleStartGame();
  };

  // Afficher le chargement
  if ((characterLoading && !isGameStarted) || (loading && !gameState)) {
    return <Loading />;
  }

  // Afficher les erreurs
  if (characterError || error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage 
          message={characterError || error || "An error occurred"}
          onRetry={error ? resetGame : undefined}
        />
      </div>
    );
  }

  // Si l'utilisateur n'a pas de personnage actif
  if (!activeCharacter && !isGameStarted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <div className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">No Active Character</h2>
            <p className="mb-4">You need to create or select a character to play the board game.</p>
            <div className="space-x-4">
              <Button 
                variant="primary" 
                onClick={() => navigate('/characters/create')}
              >
                Create Character
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => navigate('/characters')}
              >
                Select Character
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* En-tête de page */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Adventure Board Game</h1>
        <p className="text-gray-600">
          Progress through the board, face challenges, find treasures and reach the end!
        </p>
      </div>
      
      {/* Écran d'accueil - Avant de commencer le jeu */}
      {!isGameStarted && !gameState && (
        <Card className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready for Adventure?</h2>
          <p className="mb-6">
            Embark on a journey across a magical board, facing monsters, finding treasures, 
            and avoiding deadly traps. Can you make it to the end?
          </p>
          
          <div className="max-w-md mx-auto bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Your Champion:</h3>
            {activeCharacter && (
              <div className="flex items-center">
                <div className="text-2xl mr-3">
                  {activeCharacter.character_type === 'warrior' ? '⚔️' : 
                   activeCharacter.character_type === 'mage' ? '🧙' : '👤'}
                </div>
                <div className="text-left">
                  <div className="font-medium">{activeCharacter.name}</div>
                  <div className="text-sm text-gray-600">
                    Level {activeCharacter.level || 1} {activeCharacter.character_type} ({activeCharacter.race})
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <Button 
            variant="primary" 
            size="lg"
            onClick={handleStartGame}
          >
            Start Adventure
          </Button>
        </Card>
      )}
      
      {/* Jeu en cours */}
      {gameState && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Plateau et journal à gauche / centre */}
          <div className="lg:col-span-2 space-y-6">
            <GameBoard gameState={gameState} gameResult={gameResult} />
            <GameResult gameState={gameState} onPlayAgain={handlePlayAgain} />
          </div>
          
          {/* Statut du personnage à droite */}
          <div>
            <GameStatus gameState={gameState} />
            
            {/* Option pour recommencer si le jeu est terminé */}
            {(gameState.is_completed || gameState.is_game_over) && (
              <div className="mt-4">
                <Button 
                  variant="primary" 
                  fullWidth
                  onClick={handlePlayAgain}
                >
                  New Adventure
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BoardGamePage;