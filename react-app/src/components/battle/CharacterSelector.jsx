import React from 'react';
import Card from '../common/Card';

function CharacterSelector({ characters, selectedId, onSelect }) {
  // Fonction pour déterminer la classe CSS de la carte sélectionnée
  const getCardClass = (characterId) => {
    return selectedId === characterId 
      ? 'border-4 border-blue-500 shadow-lg transform scale-105' 
      : 'border border-gray-200 hover:border-blue-300';
  };

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

  // Fonction pour obtenir la couleur de fond selon la classe
  const getBackgroundColor = (characterClass) => {
    switch (characterClass?.toLowerCase()) {
      case 'warrior':
        return 'bg-gradient-to-br from-red-500 to-orange-400';
      case 'mage':
        return 'bg-gradient-to-br from-blue-500 to-indigo-400';
      default:
        return 'bg-gradient-to-br from-gray-500 to-gray-400';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {characters.map(character => (
        <Card 
          key={character.id}
          className={`cursor-pointer transition-all duration-200 overflow-hidden ${getCardClass(character.id)}`}
          onClick={() => onSelect(character.id)}
        >
          <div className={`absolute top-0 left-0 right-0 h-16 ${getBackgroundColor(character.character_type)}`}></div>
          
          <div className="relative pt-12 p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{character.name}</h3>
                <div className="flex items-center text-gray-600 mt-1">
                  <span className="mr-2">{character.race}</span>
                  <span className="flex items-center">
                    {getClassIcon(character.character_type)} {character.character_type}
                  </span>
                </div>
              </div>
              
              <div className="bg-white rounded-full h-10 w-10 flex items-center justify-center shadow-md">
                <span className="font-bold">Lvl {character.level || 1}</span>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Health:</span>
                <div className="w-32 bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="h-2.5 rounded-full bg-red-500" 
                    style={{ width: `${Math.min(100, character.health)}%` }}
                  ></div>
                </div>
                <span className="font-semibold">{character.health}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Attack:</span>
                <div className="w-32 bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="h-2.5 rounded-full bg-amber-500" 
                    style={{ width: `${Math.min(100, character.attack * 5)}%` }}
                  ></div>
                </div>
                <span className="font-semibold">{character.attack}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Defense:</span>
                <div className="w-32 bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="h-2.5 rounded-full bg-blue-500" 
                    style={{ width: `${Math.min(100, character.defense * 5)}%` }}
                  ></div>
                </div>
                <span className="font-semibold">{character.defense}</span>
              </div>
            </div>
            
            <div className={`mt-4 py-1 px-3 rounded-full inline-block ${
              selectedId === character.id ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {selectedId === character.id ? 'Selected' : 'Select'}
            </div>
          </div>
        </Card>
      ))}

      {characters.length === 0 && (
        <div className="col-span-full text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No characters available. Create some heroes first!</p>
        </div>
      )}
    </div>
  );
}

export default CharacterSelector;