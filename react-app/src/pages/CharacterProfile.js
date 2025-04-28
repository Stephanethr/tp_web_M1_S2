import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCharacterInfo } from '../api/apiService';
import { useAuth } from '../context/AuthContext';

const CharacterProfile = () => {
  const { user } = useAuth();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCharacterInfo = async () => {
      try {
        setLoading(true);
        const characterData = await getCharacterInfo();
        if (!characterData) {
          navigate('/characters');
          return;
        }
        setCharacter(characterData);
      } catch (err) {
        setError('Erreur lors du chargement des données du personnage');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCharacterInfo();
    }
  }, [user, navigate]);

  const getAttributeColor = (value) => {
    if (value >= 80) return 'text-green-600 dark:text-green-400';
    if (value >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getProgressBarColor = (value) => {
    if (value >= 80) return 'bg-green-600';
    if (value >= 50) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const renderProgressBar = (value, max = 100) => {
    const percentage = (value / max) * 100;
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div 
          className={`${getProgressBarColor(value)} h-2.5 rounded-full`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg className="animate-spin h-10 w-10 text-accent" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
        <p>{error}</p>
        <Link to="/characters" className="font-bold hover:underline">Retour à la liste des personnages</Link>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Aucun personnage actif</h2>
        <p className="mb-6">Vous devez créer ou sélectionner un personnage.</p>
        <div className="space-x-4">
          <Link to="/character/create" className="btn-primary">Créer un personnage</Link>
          <Link to="/characters" className="btn-secondary">Sélectionner un personnage</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <Link to="/characters" className="text-accent hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Retour à la liste des personnages
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="card">
            <div className="flex flex-col items-center pb-6">
              <div className="w-24 h-24 mb-3 rounded-full bg-accent flex items-center justify-center text-white text-4xl font-bold">
                {character.name.charAt(0)}
              </div>
              <h1 className="text-2xl font-bold">{character.name}</h1>
              <p className="text-sm opacity-75">{character.race} {character.class}</p>
              <div className="mt-4 px-2 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
                Niveau {character.level}
              </div>
            </div>
          </div>
          
          <div className="card mt-4">
            <h2 className="text-xl font-bold mb-4">Actions</h2>
            <div className="space-y-2">
              <Link to="/inventory" className="btn-primary w-full block text-center">
                Voir l'inventaire
              </Link>
              <Link to="/quests" className="btn-secondary w-full block text-center">
                Partir en quête
              </Link>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="card mb-6">
            <h2 className="text-xl font-bold mb-4">Statistiques</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Santé</span>
                  <span className={getAttributeColor(character.health)}>{character.health}/100</span>
                </div>
                {renderProgressBar(character.health)}
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span>Attaque</span>
                  <span className={getAttributeColor(character.attack)}>{character.attack}</span>
                </div>
                {renderProgressBar(character.attack)}
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span>Défense</span>
                  <span className={getAttributeColor(character.defense)}>{character.defense}</span>
                </div>
                {renderProgressBar(character.defense)}
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Expérience</span>
                  <span>{character.xp || 0}/{character.level * 100}</span>
                </div>
                {renderProgressBar(character.xp || 0, character.level * 100)}
              </div>
            </div>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Détails du personnage</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Classe</h3>
                <p>{character.class}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Race</h3>
                <p>{character.race}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Niveau</h3>
                <p>{character.level}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">ID</h3>
                <p>#{character.id}</p>
              </div>
              
              <div className="col-span-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Compétences spéciales</h3>
                {character.class === 'warrior' ? (
                  <p>Frappe puissante, Résistance accrue</p>
                ) : character.class === 'mage' ? (
                  <p>Boule de feu, Bouclier magique</p>
                ) : (
                  <p>Aucune compétence spéciale</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterProfile;