import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navigation principale */}
      <nav className="bg-primary text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-xl font-bold">RPG Game</Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Accueil</Link>
                <Link to="/characters" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Personnages</Link>
                <Link to="/quests" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Quêtes</Link>
                <Link to="/versus" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Versus</Link>
                <Link to="/board-game" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Plateau</Link>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="mr-4">{user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="btn btn-danger"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;