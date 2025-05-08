// src/pages/characters/CharacterDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCharacterById, selectActiveCharacter } from '../../api/characters';
import Button from '../../components/common/Button';
import { useCharacters } from '../../hooks/useCharacters';

const CharacterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectCharacter, activeCharacter } = useCharacters();
  const [character, setCharacter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        setIsLoading(true);
        const data = await getCharacterById(id);
        setCharacter(data.character);
      } catch (error) {
        console.error('Erreur lors de la récupération du personnage:', error);
        setError('Impossible de charger les détails du personnage.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  const handleSelectCharacter = async () => {
    try {
      setIsSelecting(true);
      await selectCharacter(id);
      // Afficher un message de succès ou rediriger
    } catch (error) {
      console.error('Erreur lors de la sélection du personnage:', error);
      setError('Impossible de sélectionner ce personnage.');
    } finally {
      setIsSelecting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
        <Button onClick={() => navigate('/characters')} variant="secondary">
          Retour à la liste des personnages
        </Button>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p>Ce personnage n'existe pas.</p>
        </div>
        <Button onClick={() => navigate('/characters')} variant="secondary">
          Retour à la liste des personnages
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/characters')}
            className="mr-4 text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Retour
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Détails du personnage</h1>
        </div>
        <div>
          {character.is_active ? (
            <span className="inline-flex items-center bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
              <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
              Personnage actif
            </span>
          ) : (
            <Button 
              onClick={handleSelectCharacter} 
              isLoading={isSelecting}
              disabled={isSelecting}
            >
              Sélectionner comme actif
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-xl font-semibold text-gray-900">{character.name}</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {character.race} • {character.class} • Niveau {character.level}
          </p>
        </div>
        
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Santé</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {character.health}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Attaque</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {character.attack}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Défense</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {character.defense}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Expérience</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {character.experience} / {character.next_level_exp}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">Inventaire</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Objets et équipement du personnage
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5">
            <Link to="/inventory" className="text-primary hover:text-primary/80 font-medium">
              Voir l'inventaire complet →
            </Link>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">Modes de jeu</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Commencer une partie avec ce personnage
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 space-y-4">
            <div>
              <Link 
                to="/game/versus" 
                className="text-primary hover:text-primary/80 font-medium block mb-2"
              >
                Mode Versus →
              </Link>
              <p className="text-sm text-gray-500">Affrontez d'autres personnages en duel</p>
            </div>
            <div>
              <Link 
                to="/game/quest" 
                className="text-primary hover:text-primary/80 font-medium block mb-2"
              >
                Mode Quête →
              </Link>
              <p className="text-sm text-gray-500">Partez à l'aventure et accomplissez des quêtes</p>
            </div>
            <div>
              <Link 
                to="/game/board" 
                className="text-primary hover:text-primary/80 font-medium block mb-2"
              >
                Jeu de plateau →
              </Link>
              <p className="text-sm text-gray-500">Explorez le monde à travers un jeu de plateau</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetail;