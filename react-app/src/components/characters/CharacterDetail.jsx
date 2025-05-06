// components/characters/CharacterDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import characterService from '../../services/characterService';

const CharacterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacterDetail = async () => {
      setLoading(true);
      const response = await characterService.getCharacterStats(id);
      
      if (response.success) {
        setCharacter(response.character);
        setError(null);
      } else {
        setError(response.message || 'Une erreur est survenue');
        // Rediriger vers la liste des personnages si le personnage n'est pas trouvé
        if (response.status === 404) {
          setTimeout(() => navigate('/characters'), 2000);
        }
      }
      
      setLoading(false);
    };

    fetchCharacterDetail();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Erreur ! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      {character && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{character.name}</h2>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Niveau {character.level}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Informations de base */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-semibold text-lg text-gray-800 mb-3">Informations</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Classe:</span>
                  <span className="font-medium">{character.class_info?.name || character.class}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Race:</span>
                  <span className="font-medium">{character.race.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expérience:</span>
                  <span className="font-medium">{character.experience} / {character.level * 100}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Or:</span>
                  <span className="font-medium">{character.gold}</span>
                </div>
              </div>
            </div>
            
            {/* Statistiques */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-semibold text-lg text-gray-800 mb-3">Statistiques</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded shadow-sm text-center">
                  <span className="block text-sm text-gray-500 mb-1">Santé</span>
                  <span className="font-bold text-xl text-blue-700">{character.health}</span>
                </div>
                <div className="bg-white p-3 rounded shadow-sm text-center">
                  <span className="block text-sm text-gray-500 mb-1">Attaque</span>
                  <span className="font-bold text-xl text-blue-700">{character.attack}</span>
                </div>
                <div className="bg-white p-3 rounded shadow-sm text-center">
                  <span className="block text-sm text-gray-500 mb-1">Défense</span>
                  <span className="font-bold text-xl text-blue-700">{character.defense}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Description de la classe et de la race */}
          <div className="mt-6 space-y-4">
            {character.class_info && (
              <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">Classe: {character.class_info.name}</h3>
                <p className="text-gray-700">{character.class_info.description}</p>
              </div>
            )}
            
            <div className="bg-green-50 p-4 rounded-md border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">Race: {character.race.name}</h3>
              <p className="text-gray-700">{character.race.description}</p>
            </div>
          </div>
          
          {/* Bouton pour activer/désactiver comme personnage principal */}
          {!character.is_active && (
            <div className="mt-6 flex justify-center">
              <button 
                onClick={async () => {
                  const response = await characterService.setActiveCharacter(character.id);
                  if (response.success) {
                    // Recharger les détails du personnage pour refléter le changement
                    setCharacter({...character, is_active: true});
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Définir comme personnage actif
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CharacterDetail;
