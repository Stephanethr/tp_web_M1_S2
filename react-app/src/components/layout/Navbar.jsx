// src/components/layout/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isGameMenuOpen, setIsGameMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Partie gauche - Logo & Nom utilisateur */}
          <div className="flex items-center">
            <span className="text-yellow-400 font-bold text-xl">RPG</span>
            <span className="ml-4 text-gray-300">
              Bonjour, {user.username || 'Aventurier'} !
            </span>
          </div>

          {/* Menu central */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-yellow-400 transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M13 3v2h7V3h-7zM5 7h16v2H5V7zm0 5h16v2H5v-2zm0 5h16v2H5v-2z"/>
              </svg>
              Accueil
            </Link>

            <Link
              to="/characters"
              className="text-gray-300 hover:text-yellow-400 transition-colors"
            >
              Personnages
            </Link>

            <Link
              to="/inventory"
              className="text-gray-300 hover:text-yellow-400 transition-colors"
            >
              Inventaire
            </Link>

            {/* Menu déroulant Jeux */}
            <div 
              className="relative"
              onMouseEnter={() => setIsGameMenuOpen(true)}
              onMouseLeave={() => setIsGameMenuOpen(false)}
            >
              <button className="text-gray-300 hover:text-yellow-400 transition-colors">
                Modes de Jeu ▾
              </button>
              
              {isGameMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-xl z-50">
                  <Link
                    to="/game/combat"
                    className="block px-4 py-3 hover:bg-gray-600 rounded-t-lg"
                  >
                    🗡️ Combat
                  </Link>
                  <Link
                    to="/game/quest"
                    className="block px-4 py-3 hover:bg-gray-600"
                  >
                    🧭 Quêtes
                  </Link>
                  <Link
                    to="/game/board"
                    className="block px-4 py-3 hover:bg-gray-600 rounded-b-lg"
                  >
                    🎲 Plateau
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Partie droite - Déconnexion */}
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-300 hover:text-red-400 transition-colors"
          >
            <ArrowLeftOnRectangleIcon className="h-6 w-6 mr-1" />
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;