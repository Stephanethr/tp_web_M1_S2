// src/components/layout/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCharacters } from '../../hooks/useCharacters';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { activeCharacter } = useCharacters();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary text-white fixed w-full z-10 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold">RPG Game</span>
            </Link>
          </div>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md hover:bg-primary-dark transition-colors">
              Accueil
            </Link>
            <Link to="/characters" className="px-3 py-2 rounded-md hover:bg-primary-dark transition-colors">
              Personnages
            </Link>
            {activeCharacter && (
              <>
                <Link to="/inventory" className="px-3 py-2 rounded-md hover:bg-primary-dark transition-colors">
                  Inventaire
                </Link>
                <div className="relative group">
                  <button className="px-3 py-2 rounded-md hover:bg-primary-dark transition-colors">
                    Jouer ▼
                  </button>
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                    <Link 
                      to="/game/versus" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      Mode Versus
                    </Link>
                    <Link 
                      to="/game/quest" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      Mode Quête
                    </Link>
                    <Link 
                      to="/game/board" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      Jeu de plateau
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Menu utilisateur */}
          <div className="hidden md:flex items-center">
            <div className="relative ml-3 group">
              <button 
                className="flex items-center text-sm rounded-full focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="mr-2">{user?.username || 'Utilisateur'}</span>
                {activeCharacter && (
                  <span className="text-xs bg-primary-light px-2 py-1 rounded-full">
                    {activeCharacter.name}
                  </span>
                )}
              </button>
              
              <div 
                className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 ${
                  isMenuOpen ? 'block' : 'hidden'
                }`}
              >
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>

          {/* Menu Mobile */}
          <div className="md:hidden flex items-center">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-primary-dark focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg 
                className="h-6 w-6" 
                stroke="currentColor" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile (ouvert/fermé) */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link 
            to="/"
            className="block px-3 py-2 rounded-md hover:bg-primary-dark"
            onClick={() => setIsMenuOpen(false)}
          >
            Accueil
          </Link>
          <Link 
            to="/characters"
            className="block px-3 py-2 rounded-md hover:bg-primary-dark"
            onClick={() => setIsMenuOpen(false)}
          >
            Personnages
          </Link>
          {activeCharacter && (
            <>
              <Link 
                to="/inventory"
                className="block px-3 py-2 rounded-md hover:bg-primary-dark"
                onClick={() => setIsMenuOpen(false)}
              >
                Inventaire
              </Link>
              <div className="py-1">
                <p className="px-3 py-2 text-primary-light font-medium">Jouer</p>
                <Link 
                  to="/game/versus"
                  className="block px-3 py-2 pl-6 rounded-md hover:bg-primary-dark"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mode Versus
                </Link>
                <Link 
                  to="/game/quest"
                  className="block px-3 py-2 pl-6 rounded-md hover:bg-primary-dark"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mode Quête
                </Link>
                <Link 
                  to="/game/board"
                  className="block px-3 py-2 pl-6 rounded-md hover:bg-primary-dark"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Jeu de plateau
                </Link>
              </div>
            </>
          )}
          <button 
            onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2 rounded-md text-primary-light hover:bg-primary-dark"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;