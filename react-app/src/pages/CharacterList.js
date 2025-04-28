import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCharacters, selectCharacter } from '../api/apiService';

const CharacterList = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCharacterId, setActiveCharacterId] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const data = await getCharacters();
        if (data.success) {
          setCharacters(data.characters);
          setActiveCharacterId(data.active_character_id);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Erreur lors du chargement des personnages');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  const handleSelectCharacter = async (characterId) => {
    try {
      const data = await selectCharacter(characterId);
      if (data.success) {
        setActiveCharacterId(characterId);
        // Mettre à jour la liste pour refléter le personnage actif
        setCharacters(characters.map(char => ({
          ...char,
          is_active: char.id === characterId
        })));
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Erreur lors de la sélection du personnage');
    }
  };

  if (loading) {
    return <div className="text-center py-10">Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mes Personnages</h1>
        <Link to="/create-character" className="btn btn-primary">
          Créer un nouveau personnage
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {characters.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600 mb-4">Vous n'avez pas encore de personnages.</p>
          <Link to="/create-character" className="btn btn-primary">
            Créer votre premier personnage
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character) => (
            <div 
              key={character.id}
              className={`card hover:shadow-lg transition-shadow ${
                character.id === activeCharacterId ? 'border-2 border-accent' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold">{character.name}</h2>
                {character.id === activeCharacterId && (
                  <span className="bg-accent text-white px-2 py-1 rounded text-xs">Actif</span>
                )}
              </div>
              
              <div className="mt-2">
                <p className="text-gray-600"><span className="font-semibold">Race:</span> {character.race}</p>
                <p className="text-gray-600"><span className="font-semibold">Classe:</span> {character.class}</p>
                <p className="text-gray-600"><span className="font-semibold">Niveau:</span> {character.level}</p>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700">PV: {character.health}</span>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 ml-2">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${character.health}%` }}></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Attaque: {character.attack}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Défense: {character.defense}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  className={`btn ${character.id === activeCharacterId ? 'bg-gray-400 cursor-not-allowed' : 'btn-primary'}`}
                  onClick={() => handleSelectCharacter(character.id)}
                  disabled={character.id === activeCharacterId}
                >
                  {character.id === activeCharacterId ? 'Sélectionné' : 'Sélectionner'}
                </button>
                
                <Link 
                  to="/character-profile"
                  className="btn bg-gray-600 hover:bg-gray-700 text-center"
                  onClick={() => {
                    if (character.id !== activeCharacterId) {
                      handleSelectCharacter(character.id);
                    }
                  }}
                >
                  Détails
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CharacterList;