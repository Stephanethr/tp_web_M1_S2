import React from 'react';
import { Helmet } from 'react-helmet';
import CharacterList from '../components/characters/CharacterList';

const CharactersPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Mes Personnages | RPG Game</title>
      </Helmet>
      
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <CharacterList />
        </div>
      </div>
    </div>
  );
};

export default CharactersPage;
