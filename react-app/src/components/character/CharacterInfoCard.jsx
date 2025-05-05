import React from 'react';
import Card from '../common/Card';

function CharacterInfoCard({ character }) {
  // Fonction pour obtenir l'icône de classe
  const getClassIcon = (characterClass) => {
    switch (characterClass?.toLowerCase()) {
      case 'warrior':
        return '⚔️';
      case 'mage':
        return '🧙';
      default:
        return '👤';
    }
  };

  // Fonction pour obtenir l'icône de race
  const getRaceIcon = (race) => {
    switch (race?.toLowerCase()) {
      case 'human':
        return '👨';
      case 'elf':
        return '🧝';
      case 'dwarf':
        return '👷';
      case 'orc':
        return '👹';
      default:
        return '👤';
    }
  };

  // Calculer le pourcentage de santé
  const healthPercentage = Math.max(0, Math.min(100, (character.health / 100) * 100));
  
  const getHealthBarColor = (percentage) => {
    if (percentage > 70) return 'bg-green-500';
    if (percentage > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (!character) return null;

  return (
    <Card className="border-l-4 border-indigo-500">
      <div className="flex flex-col md:flex-row items-start md:items-center">
        <div className="flex-1">
          <div className="flex items-center">
            <h2 className="text-xl font-bold mr-2">{character.name}</h2>
            <span className="text-sm px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full">
              Level {character.level || 1}
            </span>
          </div>
          
          <div className="flex items-center mt-1 text-gray-600">
            <span className="mr-3">
              {getRaceIcon(character.race)} {character.race}
            </span>
            <span>
              {getClassIcon(character.character_type)} {character.character_type}
            </span>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 w-full md:w-64">
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold">Health</span>
            <span>{character.health || 0}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${getHealthBarColor(healthPercentage)}`}
              style={{ width: `${healthPercentage}%` }}
            ></div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="text-gray-600">
              <span className="font-medium">Attack:</span> {character.attack || 0}
            </div>
            <div className="text-gray-600">
              <span className="font-medium">Defense:</span> {character.defense || 0}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default CharacterInfoCard;