import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { motion } from 'framer-motion';

function GameResult({ gameState, onPlayAgain }) {
  if (!gameState) {
    return null;
  }

  const isCompleted = gameState.is_completed;
  const isGameOver = gameState.is_game_over;
  
  // Si le jeu n'est pas terminé, ne rien afficher
  if (!isCompleted && !isGameOver) {
    return null;
  }

  // Animations
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      variants={containerAnimation}
      initial="hidden"
      animate="show"
    >
      <Card className={`border-t-4 ${isCompleted ? 'border-green-500' : 'border-red-500'}`}>
        <div className="p-6">
          <motion.h2 
            variants={itemAnimation} 
            className={`text-2xl font-bold mb-4 text-center ${
              isCompleted ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isCompleted 
              ? '🎉 Adventure Completed! 🎉' 
              : '☠️ Game Over ☠️'}
          </motion.h2>
          
          <motion.div variants={itemAnimation} className="mb-6">
            <p className="text-lg text-center mb-2">
              {isCompleted
                ? `Congratulations! ${gameState.hero.name} has completed the adventure!`
                : `${gameState.hero.name} has fallen during the adventure.`}
            </p>
            <p className="text-gray-600 text-center">
              {isCompleted
                ? 'Your character has gained experience and will become stronger.'
                : 'Better luck next time.'}
            </p>
          </motion.div>
          
          <motion.div variants={itemAnimation} className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Adventure Summary:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Distance Covered:</span>
                <span className="ml-2 font-medium">
                  {gameState.current_position} / {gameState.length} tiles
                </span>
              </div>
              <div>
                <span className="text-gray-600">Final Health:</span>
                <span className={`ml-2 font-medium ${gameState.hero.health < 30 ? 'text-red-600' : ''}`}>
                  {gameState.hero.health} / 100
                </span>
              </div>
              
              {/* Ajoutez ici d'autres statistiques pertinentes */}
            </div>
          </motion.div>
  
          <motion.div variants={itemAnimation} className="text-center">
            <Button 
              variant={isCompleted ? "success" : "primary"}
              size="lg"
              onClick={onPlayAgain}
            >
              Play Again
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}

export default GameResult;