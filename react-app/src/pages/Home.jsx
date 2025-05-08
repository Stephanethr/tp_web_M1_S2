// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCharacters } from '../hooks/useCharacters';

const Home = () => {
  const { user } = useAuth();
  const { characters, activeCharacter, isLoading } = useCharacters();

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Bienvenue dans le RPG, {user?.username || 'Aventurier'} !</h1>
        <p className="text-xl text-gray-600">Préparez-vous pour l'aventure. Choisissez un personnage et commencez à jouer !</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Vos personnages</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : characters.length > 0 ? (
            <div>
              <div className="mb-4">
                <p className="text-gray-600">Vous avez {characters.length} personnage{characters.length > 1 ? 's' : ''}.</p>
                {activeCharacter ? (
                  <p className="text-gray-600 mt-1">
                    Personnage actif : <span className="font-semibold">{activeCharacter.name}</span> (Niveau {activeCharacter.level})
                  </p>
                ) : (
                  <p className="text-yellow-600 mt-1">Vous n'avez pas sélectionné de personnage actif.</p>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Link 
                  to="/characters" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
                >
                  Gérer mes personnages
                </Link>
                
                {activeCharacter && (
                  <Link 
                    to={`/characters/${activeCharacter.id}`} 
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
                  >
                    Voir {activeCharacter.name}
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-4">Vous n'avez pas encore de personnage. Créez-en un pour commencer à jouer !</p>
              <Link 
                to="/characters/create" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
              >
                Créer un personnage
              </Link>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Modes de jeu</h2>
          
          {activeCharacter ? (
            <div className="space-y-4">
              <div className="border rounded-lg p-4 hover:border-primary/50 hover:bg-gray-50 transition-colors">
                <Link to="/game/versus" className="flex justify-between items-center group">
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-primary">Mode Versus</h3>
                    <p className="text-sm text-gray-500">Affrontez d'autres personnages en duel</p>
                  </div>
                  <span className="text-gray-400 group-hover:text-primary">→</span>
                </Link>
              </div>
              
              <div className="border rounded-lg p-4 hover:border-primary/50 hover:bg-gray-50 transition-colors">
                <Link to="/game/quest" className="flex justify-between items-center group">
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-primary">Mode Quête</h3>
                    <p className="text-sm text-gray-500">Partez à l'aventure et accomplissez des quêtes</p>
                  </div>
                  <span className="text-gray-400 group-hover:text-primary">→</span>
                </Link>
              </div>
              
              <div className="border rounded-lg p-4 hover:border-primary/50 hover:bg-gray-50 transition-colors">
                <Link to="/game/board" className="flex justify-between items-center group">
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-primary">Jeu de plateau</h3>
                    <p className="text-sm text-gray-500">Explorez le monde à travers un jeu de plateau</p>
                  </div>
                  <span className="text-gray-400 group-hover:text-primary">→</span>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-4">
                Vous devez sélectionner un personnage actif avant de pouvoir jouer.
              </p>
              
              {characters.length > 0 ? (
                <Link 
                  to="/characters" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
                >
                  Choisir un personnage
                </Link>
              ) : (
                <Link 
                  to="/characters/create" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
                >
                  Créer un personnage
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h2 className="text-xl font-semibold mb-3">Inventaire</h2>
        <p className="text-gray-600 mb-4">
          {activeCharacter 
            ? "Consultez et gérez l'inventaire de votre personnage actif."
            : "Sélectionnez d'abord un personnage pour accéder à son inventaire."
          }
        </p>
        <Link 
          to="/inventory" 
          className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
            activeCharacter
              ? "border-transparent shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
              : "border-gray-300 text-gray-300 bg-white cursor-not-allowed"
          }`}
          onClick={e => !activeCharacter && e.preventDefault()}
        >
          {activeCharacter ? "Voir l'inventaire" : "Inventaire (sélectionnez un personnage)"}
        </Link>
      </div>
    </div>
  );
};

export default Home;