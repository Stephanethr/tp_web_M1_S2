import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon, SparklesIcon, HeartIcon } from '@heroicons/react/24/solid';
import characterService from '../../services/characterService';

const CharacterCard = ({ character, isActive, onSelect, refreshList }) => {
  const handleSelectCharacter = async () => {
    try {
      await characterService.setActiveCharacter(character.id);
      onSelect(character.id);
      refreshList();
    } catch (error) {
      console.error("Erreur lors de la sélection du personnage:", error);
    }
  };

  // Détermine l'image à utiliser en fonction de la classe et de la race du personnage
  const getCharacterImage = () => {
    if (character.class.toLowerCase() === 'warrior') {
      return '/images/warrior.png';
    } else if (character.class.toLowerCase() === 'mage') {
      return '/images/mage.png';
    } 
    return '/images/default-character.png';
  };

  // Classes CSS conditionnelles
  const cardClass = isActive
    ? 'bg-primary-50 border-primary-500 shadow-lg'
    : 'bg-white border-gray-200 hover:border-primary-300 hover:shadow-md';

  return (
    <div className={`relative rounded-lg border-2 transition-all duration-200 ${cardClass}`}>
      {isActive && (
        <div className="absolute -top-3 -right-3 bg-primary-500 text-white rounded-full p-1">
          <SparklesIcon className="h-5 w-5" />
        </div>
      )}
      
      <div className="p-5">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-full overflow-hidden">
            <img 
              src={getCharacterImage()} 
              alt={`${character.name}`} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = '/images/default-character.png';
              }}
            />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{character.name}</h3>
            <div className="text-sm text-gray-500 capitalize">
              {character.race} {character.class} • Niveau {character.level}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="flex items-center">
            <HeartIcon className="h-4 w-4 text-red-500 mr-1" />
            <span className="text-sm">{character.health}</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">{character.attack}</span>
          </div>
          <div className="flex items-center">
            <ShieldCheckIcon className="h-4 w-4 text-blue-500 mr-1" />
            <span className="text-sm">{character.defense}</span>
          </div>
        </div>
        
        <div className="mt-5 space-y-2">
          {!isActive ? (
            <button
              onClick={handleSelectCharacter}
              className="w-full py-2 bg-primary-600 text-sm font-medium text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Sélectionner
            </button>
          ) : (
            <button
              disabled
              className="w-full py-2 bg-gray-200 text-sm font-medium text-gray-700 rounded-md cursor-not-allowed"
            >
              Personnage actif
            </button>
          )}
          
          <Link 
            to={`/characters/${character.id}`}
            className="block w-full py-2 bg-white text-sm font-medium text-primary-600 border border-primary-300 rounded-md text-center hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Voir détails
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
