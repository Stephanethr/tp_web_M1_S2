import React from 'react';
import { Link } from 'react-router-dom';
import useCharacter from '../../hooks/useCharacter';
import Button from '../common/Button';
import Card from '../common/Card';

// Obtenir l'icône selon la race et la classe du personnage
const getCharacterIcon = (race, characterClass) => {
  if (characterClass === 'warrior') {
    return '⚔️';
  } else if (characterClass === 'mage') {
    return '🧙';
  } else {
    return '👤';
  }
};

// Fonction pour obtenir une couleur de fond selon la race
const getBackgroundColor = (race) => {
  switch (race.toLowerCase()) {
    case 'human':
      return 'bg-blue-100';
    case 'elf':
      return 'bg-green-100';
    case 'dwarf':
      return 'bg-amber-100';
    case 'orc':
      return 'bg-red-100';
    default:
      return 'bg-gray-100';
  }
};

function CharacterCard({ character }) {
  const { selectCharacter } = useCharacter();

  const handleSelect = async () => {
    await selectCharacter(character.id);
  };

  return (
    <Card className={`${character.is_active ? 'ring-2 ring-indigo-500' : ''}`}>
      <div className="flex items-start">
        <div className={`flex-shrink-0 p-3 rounded-full ${getBackgroundColor(character.race)}`}>
          <span className="text-3xl" role="img" aria-label={`${character.race} ${character.class}`}>
            {getCharacterIcon(character.race, character.class)}
          </span>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-semibold">{character.name}</h3>
          <p className="text-gray-600 capitalize">
            {character.race} {character.class} • Level {character.level}
          </p>
          
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Health:</span> 
              <span className="ml-1 font-medium">{character.health}</span>
            </div>
            <div>
              <span className="text-gray-500">Attack:</span> 
              <span className="ml-1 font-medium">{character.attack}</span>
            </div>
            <div>
              <span className="text-gray-500">Defense:</span> 
              <span className="ml-1 font-medium">{character.defense}</span>
            </div>
          </div>

          {character.is_active && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active Character
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex space-x-2">
        <Link to={`/characters/${character.id}`} className="flex-1">
          <Button variant="light" fullWidth>View</Button>
        </Link>
        {!character.is_active && (
          <Button onClick={handleSelect} fullWidth>Select</Button>
        )}
      </div>
    </Card>
  );
}

export default CharacterCard;