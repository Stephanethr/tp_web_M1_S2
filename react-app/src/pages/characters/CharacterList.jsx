// src/pages/characters/CharacterList.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCharacters } from '../../hooks/useCharacters';
import { useAuth } from '../../hooks/useAuth';
import { deleteCharacter } from '../../api/characters';
import Button from '../../components/common/Button';

// Icônes pour les différentes classes et races de personnages
const getClassIcon = (characterClass) => {
  const classIcons = {
    'warrior': '⚔️',
    'mage': '🔮',
    'archer': '🏹',
    'healer': '💉',
    // Ajouter d'autres classes selon votre jeu
    'default': '👤'
  };
  return classIcons[characterClass?.toLowerCase()] || classIcons.default;
};

const getRaceIcon = (race) => {
  const raceIcons = {
    'human': '👨',
    'elf': '🧝',
    'dwarf': '🧔',
    'orc': '👹',
    // Ajouter d'autres races selon votre jeu
    'default': '👤'
  };
  return raceIcons[race?.toLowerCase()] || raceIcons.default;
};

const CharacterList = () => {
  const { characters, activeCharacter, isLoading, error, loadCharacters, selectCharacter } = useCharacters();
  const { user } = useAuth();
  const [deletingId, setDeletingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Recharger les personnages au montage du composant
    loadCharacters();
  }, [loadCharacters]);

  const handleSelectCharacter = async (id) => {
    setSelectedId(id);
    const success = await selectCharacter(id);
    if (success) {
      setSelectedId(null);
      // Optionnellement rediriger vers le dashboard ou la page du personnage
    }
  };

  const handleDeleteCharacter = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce personnage ? Cette action est irréversible.")) {
      try {
        setDeletingId(id);
        await deleteCharacter(id);
        loadCharacters(); // Recharger la liste après suppression
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Impossible de supprimer ce personnage. Veuillez réessayer.');
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (isLoading && characters.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mes Personnages</h1>
        <Link
          to="/characters/create"
          className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md transition-colors"
        >
          Créer un personnage
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {characters.length === 0 && !isLoading ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Vous n'avez pas encore de personnage</h2>
          <p className="text-gray-600 mb-6">Créez votre premier personnage pour commencer l'aventure!</p>
          <Link
            to="/characters/create"
            className="bg-primary hover:bg-primary/90 text-white py-2 px-6 rounded-md transition-colors"
          >
            Créer un personnage
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character) => (
            <div 
              key={character.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${character.is_active ? 'border-primary' : 'border-transparent'}`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{character.name}</h2>
                    <div className="flex items-center mt-1 text-sm text-gray-600">
                      <span className="mr-1">{getRaceIcon(character.race)}</span>
                      <span className="capitalize">{character.race}</span>
                      <span className="mx-2">•</span>
                      <span className="mr-1">{getClassIcon(character.class)}</span>
                      <span className="capitalize">{character.class}</span>
                    </div>
                  </div>
                  <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    Lvl {character.level}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <div className="text-xs text-gray-500">Santé</div>
                    <div className="font-semibold text-gray-900">{character.health}</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <div className="text-xs text-gray-500">Attaque</div>
                    <div className="font-semibold text-gray-900">{character.attack}</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <div className="text-xs text-gray-500">Défense</div>
                    <div className="font-semibold text-gray-900">{character.defense}</div>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4">
                  <Button 
                    variant={character.is_active ? "secondary" : "primary"}
                    className="flex-1"
                    disabled={character.is_active}
                    isLoading={selectedId === character.id}
                    onClick={() => handleSelectCharacter(character.id)}
                  >
                    {character.is_active ? 'Actif' : 'Sélectionner'}
                  </Button>
                  <Link 
                    to={`/characters/${character.id}`}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
                  >
                    Détails
                  </Link>
                  <button 
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors flex items-center justify-center"
                    onClick={() => handleDeleteCharacter(character.id)}
                    disabled={deletingId === character.id}
                  >
                    {deletingId === character.id ? (
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : '🗑️'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CharacterList;