import React from 'react';
import { useNavigate } from 'react-router-dom';
import CharacterList from '../components/character/CharacterList';

function CharactersPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <CharacterList />
    </div>
  );
}

export default CharactersPage;