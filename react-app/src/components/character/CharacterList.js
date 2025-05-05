import React from 'react';
import { Link } from 'react-router-dom';
import CharacterCard from './CharacterCard';

function CharacterList({ characters, onSelectCharacter }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {characters.map((character) => (
        <CharacterCard 
          key={character.id} 
          character={character} 
          onSelect={() => onSelectCharacter(character.id)}
        />
      ))}
    </div>
  );
}

export default CharacterList;