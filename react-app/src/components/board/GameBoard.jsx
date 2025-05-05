import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { motion } from 'framer-motion';

function GameBoard({ gameState, gameResult }) {
  const [events, setEvents] = useState([]);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Analyser le résultat du jeu pour extraire les événements
  useEffect(() => {
    if (gameResult) {
      const eventLines = gameResult.split('\n').filter(line => line.trim() !== '');
      setEvents(eventLines);
    }
  }, [gameResult]);

  // Animation automatique des événements
  useEffect(() => {
    let timer;
    
    if (isAutoPlaying && displayIndex < events.length - 1) {
      timer = setTimeout(() => {
        setDisplayIndex(prev => prev + 1);
      }, 2000); // 2 secondes par événement
    } else if (isAutoPlaying && displayIndex >= events.length - 1) {
      setIsAutoPlaying(false);
    }
    
    return () => clearTimeout(timer);
  }, [isAutoPlaying, displayIndex, events.length]);

  // Déterminer l'état de fin du jeu
  const isGameCompleted = gameState?.is_completed;
  const isGameOver = gameState?.is_game_over;
  const heroHealth = gameState?.hero?.health || 0;

  // Fonction pour déterminer la couleur de fond d'une case
  const getCellBackground = (cellIndex, currentPosition) => {
    if (cellIndex === currentPosition) return 'bg-yellow-300'; // Position actuelle
    
    if (cellIndex < currentPosition) {
      return 'bg-green-200'; // Cases déjà visitées
    }
    
    // Cases à venir avec différents types d'événements
    switch (cellIndex % 5) {
      case 0: return 'bg-red-100';      // Combat
      case 1: return 'bg-blue-100';     // Trésor
      case 2: return 'bg-purple-100';   // Piège
      case 3: return 'bg-green-100';    // Guérison
      case 4: return 'bg-amber-100';    // Événement aléatoire
      default: return 'bg-gray-100';    // Par défaut
    }
  };

  // Fonction pour déterminer l'icône d'une case
  const getCellIcon = (cellIndex) => {
    switch (cellIndex % 5) {
      case 0: return '⚔️';   // Combat
      case 1: return '💰';   // Trésor
      case 2: return '⚠️';   // Piège
      case 3: return '❤️';   // Guérison
      case 4: return '❓';   // Événement aléatoire
      default: return '📍';  // Par défaut
    }
  };

  // Extraire les informations pour l'animation
  const parseCurrentEvent = (event) => {
    if (!event) return { icon: '📜', title: 'Event', description: 'No event' };
    
    // Détermine le type d'événement basé sur le contenu
    if (event.includes('combat') || event.includes('attacked') || event.includes('Monster')) {
      return { 
        icon: '⚔️', 
        title: 'Combat', 
        description: event,
        color: 'border-red-500 bg-red-50'
      };
    } else if (event.includes('treasure') || event.includes('gold') || event.includes('found')) {
      return { 
        icon: '💰', 
        title: 'Treasure', 
        description: event,
        color: 'border-amber-500 bg-amber-50'
      };
    } else if (event.includes('trap') || event.includes('damage') || event.includes('fell')) {
      return { 
        icon: '⚠️', 
        title: 'Trap', 
        description: event,
        color: 'border-purple-500 bg-purple-50'
      };
    } else if (event.includes('heal') || event.includes('restored') || event.includes('health')) {
      return { 
        icon: '❤️', 
        title: 'Healing', 
        description: event,
        color: 'border-green-500 bg-green-50'
      };
    } else if (event.includes('completed')) {
      return { 
        icon: '🏆', 
        title: 'Victory', 
        description: event,
        color: 'border-green-700 bg-green-100'
      };
    } else if (event.includes('died') || event.includes('Game Over')) {
      return { 
        icon: '☠️', 
        title: 'Defeat', 
        description: event,
        color: 'border-black bg-gray-100'
      };
    }
    
    // Par défaut ou événement initial
    return { 
      icon: '📜', 
      title: 'Adventure', 
      description: event,
      color: 'border-blue-500 bg-blue-50'
    };
  };

  const currentEvent = parseCurrentEvent(events[displayIndex]);

  if (!gameState) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No game in progress. Start a new adventure!</p>
      </div>
    );
  }

  // Créer les cases du plateau
  const boardLength = gameState?.length || 20;
  const currentPosition = gameState?.current_position || 0;

  // Détermine si le jeu est terminé
  const isFinished = isGameCompleted || isGameOver;

  return (
    <div className="space-y-8">
      {/* En-tête du jeu */}
      <div className="text-center">
        <div className="inline-block py-2 px-4 bg-indigo-50 rounded-lg border border-indigo-200 mb-2">
          <span className="font-medium">{gameState.hero.name}'s Adventure</span>
        </div>
        
        {isFinished && (
          <div className={`py-2 px-4 rounded-lg text-white font-bold mb-4 inline-block mx-auto ${
            isGameCompleted ? 'bg-green-600' : 'bg-red-600'
          }`}>
            {isGameCompleted ? 'Adventure Completed!' : 'Game Over!'}
          </div>
        )}
      </div>

      {/* Plateau de jeu */}
      <Card className="overflow-hidden">
        <div className="p-4 bg-indigo-50 border-b border-indigo-100">
          <h2 className="text-xl font-bold">Adventure Board</h2>
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm">
              <span className="font-medium">Position:</span> {currentPosition} / {boardLength}
            </div>
            <div className="text-sm">
              <span className="font-medium">Hero Health:</span> {heroHealth}
            </div>
          </div>
        </div>

        {/* Représentation du plateau */}
        <div className="p-4 overflow-x-auto">
          <div className="flex flex-nowrap min-w-full space-x-2 pb-2">
            {Array.from({ length: boardLength }).map((_, index) => (
              <div 
                key={index}
                className={`
                  flex-shrink-0 w-14 h-14 flex items-center justify-center 
                  rounded-lg border shadow-sm relative 
                  ${getCellBackground(index, currentPosition)}
                `}
              >
                <span className="text-xl" role="img" aria-label="Cell icon">
                  {getCellIcon(index)}
                </span>
                <span className="absolute bottom-1 right-1 text-xs font-medium">
                  {index + 1}
                </span>
                
                {/* Marqueur de position actuelle */}
                {index === currentPosition && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="animate-bounce">🧙</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Journal d'événements */}
      <Card>
        <div className="p-4 bg-amber-50 border-b border-amber-100">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Adventure Log</h2>
            <div>
              <span className="text-sm mr-2">Event {displayIndex + 1}/{events.length}</span>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          {/* Contrôles de navigation */}
          <div className="flex justify-center space-x-2 mb-4">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => setDisplayIndex(prev => Math.max(0, prev - 1))}
              disabled={displayIndex <= 0 || isAutoPlaying}
            >
              Previous
            </Button>
            
            {isAutoPlaying ? (
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => setIsAutoPlaying(false)}
              >
                Pause
              </Button>
            ) : (
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => setIsAutoPlaying(true)}
                disabled={displayIndex >= events.length - 1}
              >
                Auto Play
              </Button>
            )}
            
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => setDisplayIndex(prev => Math.min(events.length - 1, prev + 1))}
              disabled={displayIndex >= events.length - 1 || isAutoPlaying}
            >
              Next
            </Button>
            
            <Button 
              variant="light" 
              size="sm"
              onClick={() => setDisplayIndex(events.length - 1)}
              disabled={isAutoPlaying}
            >
              Jump to End
            </Button>
          </div>
          
          {/* Animation de l'événement actuel */}
          <motion.div
            key={displayIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-4 border-l-4 rounded-lg ${currentEvent.color}`}
          >
            <div className="flex items-start">
              <div className="mr-3 text-2xl">{currentEvent.icon}</div>
              <div>
                <h3 className="font-bold">{currentEvent.title}</h3>
                <p>{currentEvent.description}</p>
              </div>
            </div>
          </motion.div>
          
          {/* Liste d'événements précédents (optionnel) */}
          {displayIndex > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Previous Events</h4>
              <div className="space-y-2 max-h-28 overflow-y-auto">
                {events.slice(0, displayIndex).reverse().map((event, idx) => {
                  const { icon, title, description } = parseCurrentEvent(event);
                  return (
                    <div key={idx} className="text-sm text-gray-600 border-l-2 border-gray-300 pl-2">
                      <div className="flex items-center">
                        <span className="mr-1">{icon}</span>
                        <span className="font-medium">{title}:</span>
                        <span className="ml-1 truncate">{description}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default GameBoard;