import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

function CombatResult({ result, onReset }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [showAllRounds, setShowAllRounds] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  
  const rounds = result?.rounds || [];
  const winner = result?.winner;
  const heroName = result?.hero?.name;
  const monsterName = result?.monster?.name;
  const isHeroVictorious = winner === heroName;
  
  // Animation d'auto-play pour les rounds
  useEffect(() => {
    let timer;
    
    if (autoPlay && currentRound < rounds.length - 1) {
      timer = setTimeout(() => {
        setCurrentRound(prev => prev + 1);
      }, 1500); // 1.5 secondes par round
    } else if (autoPlay && currentRound >= rounds.length - 1) {
      setAutoPlay(false);
    }
    
    return () => clearTimeout(timer);
  }, [autoPlay, currentRound, rounds.length]);

  // Fonction pour déterminer la couleur de la barre de santé
  const getHealthBarColor = (percentage) => {
    if (percentage > 70) return 'bg-green-500';
    if (percentage > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Calculer les pourcentages de santé
  const calculateHealthPercentage = (current, original) => {
    if (!original) return 0;
    const percentage = (current / original) * 100;
    return Math.max(0, Math.min(100, percentage));
  };

  if (!result) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No combat results to display.</p>
      </div>
    );
  }

  const renderRoundDetail = (round) => {
    const heroHealthPercentage = calculateHealthPercentage(
      round.hero_health, 
      result.hero.original_health
    );
    
    const monsterHealthPercentage = calculateHealthPercentage(
      round.monster_health, 
      result.monster.original_health
    );
    
    return (
      <div key={round.round} className="p-4 bg-white rounded-lg shadow mb-3 border-l-4 border-indigo-500">
        <div className="mb-3">
          <h4 className="font-bold text-lg mb-1">Round {round.round}</h4>
          
          {round.winner && (
            <div className={`py-2 px-4 rounded-lg mb-3 text-white ${
              round.winner === heroName ? 'bg-green-500' : 'bg-red-500'
            }`}>
              <span className="font-bold">{round.winner}</span> won this battle!
            </div>
          )}
        </div>

        {/* Combattants avec barres de vie */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Héros */}
          <div className="border rounded-lg p-2">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold">{heroName}</span>
              <span>{round.hero_health} / {result.hero.original_health} HP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${getHealthBarColor(heroHealthPercentage)}`}
                style={{ width: `${heroHealthPercentage}%` }}
              ></div>
            </div>
            {round.damage_to_hero > 0 && (
              <div className="mt-1 text-right text-red-500">
                -{round.damage_to_hero} damage
              </div>
            )}
          </div>

          {/* Monstre */}
          <div className="border rounded-lg p-2">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold">{monsterName}</span>
              <span>{round.monster_health} / {result.monster.original_health} HP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${getHealthBarColor(monsterHealthPercentage)}`}
                style={{ width: `${monsterHealthPercentage}%` }}
              ></div>
            </div>
            {round.damage_to_monster > 0 && (
              <div className="mt-1 text-right text-red-500">
                -{round.damage_to_monster} damage
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 rounded-lg border p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Combat Results</h2>
        <div className={`inline-block py-2 px-4 rounded-lg text-white font-bold ${
          isHeroVictorious ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {isHeroVictorious 
            ? `${heroName} defeated ${monsterName}!` 
            : `${heroName} was defeated by ${monsterName}!`}
        </div>
      </div>

      <div className="mb-4 flex justify-center space-x-4">
        {/* Boutons de contrôle */}
        {!showAllRounds && (
          <>
            <Button 
              variant="secondary" 
              onClick={() => setCurrentRound(prev => Math.max(prev - 1, 0))}
              disabled={currentRound <= 0 || autoPlay}
            >
              Previous Round
            </Button>
            
            {autoPlay ? (
              <Button variant="primary" onClick={() => setAutoPlay(false)}>
                Pause
              </Button>
            ) : (
              <Button 
                variant="primary" 
                onClick={() => setAutoPlay(true)}
                disabled={currentRound >= rounds.length - 1}
              >
                Auto Play
              </Button>
            )}
            
            <Button 
              variant="secondary" 
              onClick={() => setCurrentRound(prev => Math.min(prev + 1, rounds.length - 1))}
              disabled={currentRound >= rounds.length - 1 || autoPlay}
            >
              Next Round
            </Button>
            
            <Button variant="light" onClick={() => setShowAllRounds(true)}>
              Show All Rounds
            </Button>
          </>
        )}
        
        {showAllRounds && (
          <Button variant="light" onClick={() => setShowAllRounds(false)}>
            Show Step by Step
          </Button>
        )}
      </div>

      <div className="overflow-y-auto max-h-96">
        {showAllRounds ? (
          // Afficher tous les rounds
          rounds.map(round => renderRoundDetail(round))
        ) : (
          // Afficher le round actuel uniquement
          currentRound < rounds.length && renderRoundDetail(rounds[currentRound])
        )}
      </div>

      <div className="mt-6 text-center">
        {isHeroVictorious ? (
          <div className="mb-4 p-3 bg-green-100 rounded-lg">
            <p className="text-green-800">
              Congratulations! You've gained experience and rewards from this quest.
            </p>
          </div>
        ) : (
          <div className="mb-4 p-3 bg-red-100 rounded-lg">
            <p className="text-red-800">
              Better luck next time. Train and prepare before challenging this foe again.
            </p>
          </div>
        )}

        <div className="flex justify-center space-x-4">
          <Button variant="primary" onClick={onReset}>
            Try Another Quest
          </Button>
          <Link to="/characters">
            <Button variant="secondary">
              Back to Characters
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CombatResult;