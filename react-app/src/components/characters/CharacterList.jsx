import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CharacterCard from './CharacterCard';
import characterService from '../../services/characterService';
import { PlusIcon } from '@heroicons/react/24/solid';

const CharacterList = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCharacterId, setActiveCharacterId] = useState(null);

  const fetchCharacters = async () => {
    try {
      setLoading(true);
      const response = await characterService.getCharacters();
      
      if (response.success) {
        setCharacters(response.characters);
        
        // Trouver le personnage actif
        const activeChar = response.characters.find(char => char.is_active);
        if (activeChar) {
          setActiveCharacterId(activeChar.id);
        }
      } else {
        setError("Erreur lors de la récupération des personnages");
      }
    } catch (err) {
      setError("Une erreur s'est produite lors de la récupération des personnages");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  const handleSelectCharacter = (id) => {
    setActiveCharacterId(id);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Erreur: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Vos personnages</h2>
        <Link
          to="/characters/create"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Nouveau personnage
        </Link>
      </div>

      {characters.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Vous n'avez pas encore de personnage</h3>
          <p className="text-gray-500 mb-4">Créez votre premier héros pour commencer l'aventure !</p>
          <Link
            to="/characters/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Créer un personnage
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              isActive={character.id === activeCharacterId}
              onSelect={handleSelectCharacter}
              refreshList={fetchCharacters}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CharacterList;
