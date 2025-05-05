import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';

function CharacterCard({ character, onSelect }) {
  const isActive = character.isActive;

  const getClassColor = (characterClass) => {
    switch (characterClass.toLowerCase()) {
      case 'warrior':
        return 'bg-red-100 text-red-800';
      case 'mage':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRaceEmoji = (race) => {
    switch (race.toLowerCase()) {
      case 'human':
        return '👨';
      case 'elf':
        return '🧝';
      case 'orc':
        return '👹';
      case 'dwarf':
        return '🧔';
      default:
        return '👤';
    }
  };

  return (
    <Card className={`relative ${isActive ? 'border-2 border-indigo-500' : ''}`}>
      {isActive && (
        <div className="absolute top-2 right-2 bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-bold">
          Active
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center mb-4">
          <div className="text-3xl mr-3">{getRaceEmoji(character.race)}</div>
          <div>
            <h3 className="text-xl font-bold">{character.name}</h3>
            <div className="flex space-x-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs ${getClassColor(character.class)}`}>
                {character.class}
              </span>
              <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                {character.race}
              </span>
              <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                Level {character.level}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center">
            <div className="text-gray-500 text-xs">Health</div>
            <div className="font-bold">{character.health}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 text-xs">Attack</div>
            <div className="font-bold">{character.attack}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 text-xs">Defense</div>
            <div className="font-bold">{character.defense}</div>
          </div>
        </div>

        <div className="flex justify-between">
          {!isActive && (
            <Button onClick={onSelect} variant="secondary" size="sm">
              Select Character
            </Button>
          )}
          <Link
            to={`/characters/${character.id}`}
            className="inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Details
          </Link>
        </div>
      </div>
    </Card>
  );
}

export default CharacterCard;