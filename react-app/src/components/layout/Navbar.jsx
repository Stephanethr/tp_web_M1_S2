import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  UserIcon,
  HomeIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  MapIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fermer le menu lors du changement de route
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <>
      {/* La navbar avec un fond solide */}
      <nav className="fixed w-full bg-white shadow-md z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo et nom du jeu */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="font-bold text-xl text-primary-800">RPG Game</span>
            </Link>

            {/* Bouton menu mobile */}
            <button
              className="md:hidden text-gray-700 hover:text-primary-600 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu principal"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>

            {/* Navigation sur desktop */}
            <div className="hidden md:flex md:items-center md:space-x-1">
              {currentUser && (
                <ul className="flex space-x-1">
                  <li>
                    <Link
                      to="/"
                      className={`px-3 py-2 rounded-md flex items-center space-x-1 ${
                        location.pathname === '/'
                          ? 'text-primary-500 font-medium'
                          : 'text-gray-700 hover:text-primary-500 hover:bg-gray-100'
                      }`}
                    >
                      <HomeIcon className="h-5 w-5" />
                      <span>Accueil</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/characters"
                      className={`px-3 py-2 rounded-md flex items-center space-x-1 ${
                        location.pathname.includes('/characters')
                          ? 'text-primary-500 font-medium'
                          : 'text-gray-700 hover:text-primary-500 hover:bg-gray-100'
                      }`}
                    >
                      <UserIcon className="h-5 w-5" />
                      <span>Personnages</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/inventory"
                      className={`px-3 py-2 rounded-md flex items-center space-x-1 ${
                        location.pathname.includes('/inventory')
                          ? 'text-primary-500 font-medium'
                          : 'text-gray-700 hover:text-primary-500 hover:bg-gray-100'
                      }`}
                    >
                      <ShoppingBagIcon className="h-5 w-5" />
                      <span>Inventaire</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/quests"
                      className={`px-3 py-2 rounded-md flex items-center space-x-1 ${
                        location.pathname.includes('/quests')
                          ? 'text-primary-500 font-medium'
                          : 'text-gray-700 hover:text-primary-500 hover:bg-gray-100'
                      }`}
                    >
                      <ClipboardDocumentListIcon className="h-5 w-5" />
                      <span>Quêtes</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/world"
                      className={`px-3 py-2 rounded-md flex items-center space-x-1 ${
                        location.pathname.includes('/world')
                          ? 'text-primary-500 font-medium'
                          : 'text-gray-700 hover:text-primary-500 hover:bg-gray-100'
                      }`}
                    >
                      <MapIcon className="h-5 w-5" />
                      <span>Monde</span>
                    </Link>
                  </li>
                </ul>
              )}
              
              {currentUser ? (
                <button
                  onClick={handleLogout}
                  className="ml-4 px-3 py-2 rounded-md text-gray-700 hover:text-red-500 hover:bg-gray-100 flex items-center space-x-1"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span>Déconnexion</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="ml-4 px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700"
                >
                  Connexion
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            {currentUser ? (
              <ul className="px-2 pt-2 pb-3 space-y-1">
                <li>
                  <Link
                    to="/"
                    className={`block px-3 py-2 rounded-md ${
                      location.pathname === '/'
                        ? 'bg-primary-100 text-primary-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-primary-500'
                    }`}
                  >
                    <div className="flex items-center">
                      <HomeIcon className="h-5 w-5 mr-2" />
                      Accueil
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/characters"
                    className={`block px-3 py-2 rounded-md ${
                      location.pathname.includes('/characters')
                        ? 'bg-primary-100 text-primary-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-primary-500'
                    }`}
                  >
                    <div className="flex items-center">
                      <UserIcon className="h-5 w-5 mr-2" />
                      Personnages
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/inventory"
                    className={`block px-3 py-2 rounded-md ${
                      location.pathname.includes('/inventory')
                        ? 'bg-primary-100 text-primary-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-primary-500'
                    }`}
                  >
                    <div className="flex items-center">
                      <ShoppingBagIcon className="h-5 w-5 mr-2" />
                      Inventaire
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/quests"
                    className={`block px-3 py-2 rounded-md ${
                      location.pathname.includes('/quests')
                        ? 'bg-primary-100 text-primary-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-primary-500'
                    }`}
                  >
                    <div className="flex items-center">
                      <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
                      Quêtes
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/world"
                    className={`block px-3 py-2 rounded-md ${
                      location.pathname.includes('/world')
                        ? 'bg-primary-100 text-primary-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-primary-500'
                    }`}
                  >
                    <div className="flex items-center">
                      <MapIcon className="h-5 w-5 mr-2" />
                      Monde
                    </div>
                  </Link>
                </li>
                <li className="border-t border-gray-200 mt-2 pt-2">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-red-50 hover:text-red-500"
                  >
                    <div className="flex items-center">
                      <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                      Déconnexion
                    </div>
                  </button>
                </li>
              </ul>
            ) : (
              <div className="px-2 pt-2 pb-3">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-center bg-primary-600 text-white font-medium hover:bg-primary-700"
                >
                  Connexion
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Espace pour éviter que le contenu ne soit sous la navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
