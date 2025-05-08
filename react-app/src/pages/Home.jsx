// src/pages/Home.jsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <button
            onClick={logout}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Déconnexion
          </button>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4 flex flex-col items-center justify-center">
              <h2 className="text-xl font-semibold mb-4">Bienvenue {user?.user_login || 'dans l\'application RPG'}</h2>
              <p className="text-gray-600 text-center mb-4">
                Commencez à gérer vos personnages, inventaires et jouez aux différents modes de jeu.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
                <button className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg text-center">
                  Mes personnages
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg text-center">
                  Inventaire
                </button>
                <button className="bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded-lg text-center">
                  Modes de jeu
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;