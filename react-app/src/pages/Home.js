import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCharacterInfo } from '../api/apiService';

const Home = () => {
  const { user } = useAuth();
  const [activeCharacter, setActiveCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacterInfo = async () => {
      try {
        setLoading(true);
        const character = await getCharacterInfo();
        setActiveCharacter(character);
        setError(null);
      } catch (err) {
        setError('Impossible de charger les informations du personnage');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCharacterInfo();
    }
  }, [user]);

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

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Tableau de Bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Carte du personnage actif */}
        <div className="card bg-gradient-to-br from-primary to-secondary text-white">
          <h2 className="text-xl font-bold mb-4">Personnage Actif</h2>
          
          {activeCharacter ? (
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-accent p-3 rounded-full mr-4">
                  <span className="text-2xl font-bold">{activeCharacter.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{activeCharacter.name}</h3>
                  <p>{activeCharacter.race} {activeCharacter.class}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-black/20 rounded p-2 text-center">
                  <p className="text-xs opacity-75">Niveau</p>
                  <p className="text-xl font-bold">{activeCharacter.level}</p>
                </div>
                <div className="bg-black/20 rounded p-2 text-center">
                  <p className="text-xs opacity-75">Santé</p>
                  <p className="text-xl font-bold">{activeCharacter.health}</p>
                </div>
                <div className="bg-black/20 rounded p-2 text-center">
                  <p className="text-xs opacity-75">Attaque</p>
                  <p className="text-xl font-bold">{activeCharacter.attack}</p>
                </div>
                <div className="bg-black/20 rounded p-2 text-center">
                  <p className="text-xs opacity-75">Défense</p>
                  <p className="text-xl font-bold">{activeCharacter.defense}</p>
                </div>
              </div>
              
              <Link to="/character/profile" className="btn-primary w-full text-center block mb-2">
                Voir le profil
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="mb-4">Vous n'avez pas de personnage actif</p>
              <Link to="/character/create" className="btn-primary inline-block">
                Créer un personnage
              </Link>
              <Link to="/characters" className="btn-secondary inline-block ml-2">
                Sélectionner un personnage
              </Link>
            </div>
          )}
        </div>
        
        {/* Carte des modes de jeu */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Modes de jeu</h2>
          <div className="space-y-2">
            <Link to="/quests" className="block p-3 border rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Quêtes</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm opacity-75">Affrontez des monstres et gagnez des récompenses</p>
            </Link>
            
            <Link to="/versus" className="block p-3 border rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Combat PVP</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm opacity-75">Affrontez vos propres personnages</p>
            </Link>
            
            <Link to="/board-game" className="block p-3 border rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Jeu de Plateau</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm opacity-75">Parcourez le plateau et relevez des défis</p>
            </Link>
          </div>
        </div>
        
        {/* Carte de l'inventaire */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Inventaire</h2>
          {activeCharacter ? (
            <div>
              <p className="mb-4">Gérez vos objets, potions et équipements</p>
              <Link to="/inventory" className="btn-primary w-full text-center block">
                Voir l'inventaire
              </Link>
            </div>
          ) : (
            <p className="opacity-75">Créez un personnage pour accéder à l'inventaire</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
