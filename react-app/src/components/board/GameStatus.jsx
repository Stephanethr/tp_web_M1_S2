import React from 'react';
import { motion } from 'framer-motion';

function GameStatus({ gameState }) {
  if (!gameState || !gameState.hero) {
    return null;
  }

  const { hero } = gameState;
  const healthPercentage = Math.max(0, Math.min(100, (hero.health / 100) * 100));
  
  // Détermine la couleur de la barre de santé
  const getHealthBarColor = (percentage) => {
    if (percentage > 70) return 'bg-green-500';
    if (percentage > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Animation pour les changements de statistiques
  const statsAnimation = {
    initial: { scale: 1 },
    animate: { scale: [1, 1.05, 1], transition: { duration: 0.3 } }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 border">
      <h2 className="text-xl font-bold mb-3">{hero.name}'s Status</h2>
      
      {/* Section santé avec animation */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="font-medium">Health</span>
          <motion.span 
            key={hero.health}
            initial="initial"
            animate="animate"
            variants={statsAnimation}
            className={`font-bold ${healthPercentage < 30 ? 'text-red-600' : ''}`}
          >
            {hero.health}/100
          </motion.span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${getHealthBarColor(healthPercentage)}`}
            style={{ width: `${healthPercentage}%` }}
          ></div>
        </div>
      </div>
      
      {/* Statistiques du personnage */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-gray-600 text-sm">Class</span>
          <div className="font-medium capitalize">{hero.type || "Unknown"}</div>
        </div>
        
        <div>
          <span className="text-gray-600 text-sm">Race</span>
          <div className="font-medium capitalize">{hero.race || "Unknown"}</div>
        </div>
        
        <div>
          <span className="text-gray-600 text-sm">Level</span>
          <motion.div 
            key={hero.level}
            initial="initial"
            animate="animate"
            variants={statsAnimation}
            className="font-medium"
          >
            {hero.level || 1}
          </motion.div>
        </div>
        
        <div>
          <span className="text-gray-600 text-sm">Attack</span>
          <motion.div 
            key={hero.attack}
            initial="initial"
            animate="animate"
            variants={statsAnimation}
            className="font-medium"
          >
            {hero.attack || 0}
          </motion.div>
        </div>
      </div>
      
      {/* Position actuelle sur le plateau */}
      <div className="mt-4 pt-3 border-t">
        <div className="flex justify-between">
          <span className="text-gray-600">Position</span>
          <span className="font-medium">{gameState.current_position} / {gameState.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="h-2 rounded-full bg-blue-500"
            style={{ width: `${(gameState.current_position / gameState.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default GameStatus;