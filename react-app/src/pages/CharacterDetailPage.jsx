import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import characterService from '../services/characterService';
import CharacterStats from '../components/characters/CharacterStats';

const CharacterDetailPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacterDetails = async () => {
      try {
        const characterId = parseInt(id);
        if (isNaN(characterId)) {
          throw new Error("ID de personnage invalide");
        }
        
        const response = await characterService.getCharacter(characterId);
        if (response.success) {
          setCharacter(response.character);
        } else {
          throw new Error(response.message || "Impossible de charger les détails du personnage");
        }
      } catch (err) {
        console.error("Erreur lors du chargement des détails du personnage:", err);
        setError(err.message || "Une erreur s'est produite");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchCharacterDetails();
    }
  }, [id, currentUser]);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-red-700">{error}</p>
              <p className="text-sm text-red-500 mt-2">
                <Link to="/characters" className="font-medium underline">
                  Retour à la liste des personnages
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-yellow-700">Personnage introuvable</p>
              <p className="text-sm text-yellow-500 mt-2">
                <Link to="/characters" className="font-medium underline">
                  Retour à la liste des personnages
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <Helmet>
        <title>{character.name} | RPG Game</title>
      </Helmet>

      <div className="mb-6">
        <Link to="/characters" className="inline-flex items-center text-primary-600 hover:text-primary-800">
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          Retour à la liste des personnages
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="bg-primary-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white flex items-center">
            {character.name}
            <span className="ml-2 px-2 py-1 text-xs rounded bg-white text-primary-700">
              Niveau {character.level}
            </span>
          </h1>
          <p className="text-primary-100 text-sm">
            {character.race.name} • {character.class.name}
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne de gauche - Portrait et informations de base */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <img 
                  src={character.avatar_url || `/images/${character.class.name.toLowerCase()}.png`} 
                  alt={character.name}
                  className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-primary-500"
                />

                <h2 className="text-lg font-semibold text-gray-900 mt-4">{character.name}</h2>
                <p className="text-gray-600 text-sm">{character.race.name} {character.class.name}</p>
                <p className="text-gray-500 text-sm mt-1">Niveau {character.level}</p>

                <div className="mt-4 space-y-2">
                  <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-primary-500 h-4" 
                      style={{ width: `${(character.experience / character.next_level_exp) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600">
                    Expérience: {character.experience} / {character.next_level_exp}
                  </p>
                </div>

                <div className="mt-6">
                  {!character.is_active && (
                    <button
                      onClick={() => {
                        characterService.setActiveCharacter(character.id)
                          .then(() => {
                            // Rafraîchir les données
                            window.location.reload();
                          })
                          .catch(err => {
                            console.error("Erreur lors de l'activation du personnage", err);
                          });
                      }}
                      className="w-full px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      Sélectionner ce personnage
                    </button>
                  )}
                  {character.is_active && (
                    <div className="px-3 py-2 bg-green-100 text-green-800 rounded-md">
                      Personnage actif
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Colonne centrale et de droite - Statistiques et équipement */}
            <div className="lg:col-span-2">
              <CharacterStats character={character} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetailPage;
