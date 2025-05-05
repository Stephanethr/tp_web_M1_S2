import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import useCharacter from '../../hooks/useCharacter';
import Button from '../common/Button';

function Navbar() {
  const { user, logout } = useAuth();
  const { activeCharacter } = useCharacter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const navigate = useNavigate();

  // Style navlink active et inactive
  const baseClass = "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200";
  const activeClassName = `${baseClass} bg-indigo-700 text-white`;
  const inactiveClassName = `${baseClass} text-gray-300 hover:bg-indigo-600 hover:text-white`;

  // Gestion du menu mobile
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Gestion du scroll pour l'effet d'ombre
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Gestion de la déconnexion
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Si l'utilisateur n'est pas connecté, pas besoin d'afficher la navbar
  if (!user) return null;

  return (
    <nav className={`bg-indigo-800 ${hasScrolled ? 'shadow-lg' : ''} sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          {/* Bouton de menu mobile */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Logo et titre - Centré sur mobile, à gauche sur desktop */}
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 flex items-center">
              <div className="text-white font-bold text-xl">RPG Quest</div>
            </div>
            
            {/* Menu Desktop */}
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-1">
                <NavLink 
                  to="/characters" 
                  className={({isActive}) => isActive ? activeClassName : inactiveClassName}
                >
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Characters
                  </div>
                </NavLink>
                
                <NavLink 
                  to="/inventory" 
                  className={({isActive}) => isActive ? activeClassName : inactiveClassName}
                >
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Inventory
                  </div>
                </NavLink>
                
                <NavLink 
                  to="/quests" 
                  className={({isActive}) => isActive ? activeClassName : inactiveClassName}
                >
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Quests
                  </div>
                </NavLink>
                
                <NavLink 
                  to="/battles" 
                  className={({isActive}) => isActive ? activeClassName : inactiveClassName}
                >
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Battles
                  </div>
                </NavLink>
                
                <NavLink 
                  to="/board-game" 
                  className={({isActive}) => isActive ? activeClassName : inactiveClassName}
                >
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                    Board Game
                  </div>
                </NavLink>
              </div>
            </div>
          </div>
          
          {/* Menu à droite - Profil et déconnexion */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Indicateur de personnage actif */}
            {activeCharacter && (
              <div className="hidden md:flex items-center px-3 py-1 mr-3 rounded-full bg-indigo-600 text-sm font-medium text-white">
                <div className="flex items-center">
                  <span className="mr-1" role="img" aria-label="Character">
                    {activeCharacter.character_type === 'warrior' && '⚔️'}
                    {activeCharacter.character_type === 'mage' && '🧙'}
                    {(!activeCharacter.character_type || 
                      (activeCharacter.character_type !== 'warrior' && 
                       activeCharacter.character_type !== 'mage')) && '👤'}
                  </span>
                  {activeCharacter.name}
                </div>
              </div>
            )}

            {/* Bouton de déconnexion */}
            <div>
              <Button 
                variant="danger" 
                size="sm"
                onClick={handleLogout}
                className="hidden sm:inline-flex"
              >
                Logout
              </Button>
              
              <button 
                onClick={handleLogout}
                className="sm:hidden p-1 rounded-full text-gray-400 hover:text-white"
                title="Logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <NavLink 
            to="/characters" 
            className={({isActive}) => 
              isActive 
                ? 'block px-3 py-2 rounded-md text-base font-medium bg-indigo-700 text-white' 
                : 'block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-indigo-600 hover:text-white'
            }
            onClick={closeMenu}
          >
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Characters
            </div>
          </NavLink>
          
          <NavLink 
            to="/inventory" 
            className={({isActive}) => 
              isActive 
                ? 'block px-3 py-2 rounded-md text-base font-medium bg-indigo-700 text-white' 
                : 'block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-indigo-600 hover:text-white'
            }
            onClick={closeMenu}
          >
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Inventory
            </div>
          </NavLink>
          
          <NavLink 
            to="/quests" 
            className={({isActive}) => 
              isActive 
                ? 'block px-3 py-2 rounded-md text-base font-medium bg-indigo-700 text-white' 
                : 'block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-indigo-600 hover:text-white'
            }
            onClick={closeMenu}
          >
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Quests
            </div>
          </NavLink>
          
          <NavLink 
            to="/battles" 
            className={({isActive}) => 
              isActive 
                ? 'block px-3 py-2 rounded-md text-base font-medium bg-indigo-700 text-white' 
                : 'block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-indigo-600 hover:text-white'
            }
            onClick={closeMenu}
          >
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Battles
            </div>
          </NavLink>
          
          <NavLink 
            to="/board-game" 
            className={({isActive}) => 
              isActive 
                ? 'block px-3 py-2 rounded-md text-base font-medium bg-indigo-700 text-white' 
                : 'block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-indigo-600 hover:text-white'
            }
            onClick={closeMenu}
          >
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              Board Game
            </div>
          </NavLink>
          
          {/* Affichage du personnage actif sur mobile */}
          {activeCharacter && (
            <div className="px-3 py-2 text-gray-300 flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <span className="text-white font-medium">{activeCharacter.name}</span>
                <span className="text-xs block text-gray-400 capitalize">
                  Lvl {activeCharacter.level || 1} {activeCharacter.character_type}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;