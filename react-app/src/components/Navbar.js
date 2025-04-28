import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, Transition } from '@headlessui/react';
import { MenuIcon, UserCircleIcon, LogoutIcon } from '@heroicons/react/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCharacter, setActiveCharacter] = useState(null);

  useEffect(() => {
    // Charger le personnage actif lors du chargement du composant
    if (user) {
      // Vous pourriez ajouter une API pour récupérer ces informations
      // Ici, nous simulons avec des données statiques
      setActiveCharacter(user.activeCharacter);
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-primary text-white fixed w-full z-10 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo et titre */}
          <Link to="/" className="text-xl font-bold">RPG Game</Link>

          {/* Menu mobile */}
          <button 
            className="md:hidden focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <MenuIcon className="h-6 w-6" />
          </button>

          {/* Menu de navigation desktop */}
          <div className="hidden md:flex space-x-4">
            <Link to="/" className="px-3 py-2 hover:bg-secondary rounded-md">
              Accueil
            </Link>
            <Link to="/characters" className="px-3 py-2 hover:bg-secondary rounded-md">
              Personnages
            </Link>
            <Link to="/inventory" className="px-3 py-2 hover:bg-secondary rounded-md">
              Inventaire
            </Link>
            <Link to="/quests" className="px-3 py-2 hover:bg-secondary rounded-md">
              Quêtes
            </Link>
            <Link to="/versus" className="px-3 py-2 hover:bg-secondary rounded-md">
              Combat PVP
            </Link>
            <Link to="/board-game" className="px-3 py-2 hover:bg-secondary rounded-md">
              Jeu de Plateau
            </Link>
          </div>

          {/* Menu utilisateur desktop */}
          {user && (
            <Menu as="div" className="relative hidden md:block">
              <Menu.Button className="flex items-center space-x-2 focus:outline-none">
                <UserCircleIcon className="h-6 w-6" />
                <span>{user.username}</span>
              </Menu.Button>

              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white text-gray-900 rounded-md shadow-lg divide-y divide-gray-100 focus:outline-none">
                  <div className="px-4 py-3">
                    <p className="text-sm">Connecté en tant que</p>
                    <p className="text-sm font-medium truncate">
                      {user.email}
                    </p>
                  </div>
                  
                  {activeCharacter && (
                    <div className="px-4 py-3">
                      <p className="text-sm">Personnage actif</p>
                      <p className="text-sm font-medium">
                        {activeCharacter.name} (Niv. {activeCharacter.level})
                      </p>
                    </div>
                  )}
                  
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/character/profile"
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } block px-4 py-2 text-sm`}
                        >
                          Profil du personnage
                        </Link>
                      )}
                    </Menu.Item>
                    
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } block w-full text-left px-4 py-2 text-sm`}
                        >
                          <div className="flex items-center">
                            <LogoutIcon className="h-4 w-4 mr-2" />
                            Déconnexion
                          </div>
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          )}
        </div>

        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 space-y-1 pb-3 pt-2">
            <Link 
              to="/" 
              className="block px-3 py-2 hover:bg-secondary rounded-md"
              onClick={toggleMobileMenu}
            >
              Accueil
            </Link>
            <Link 
              to="/characters" 
              className="block px-3 py-2 hover:bg-secondary rounded-md"
              onClick={toggleMobileMenu}
            >
              Personnages
            </Link>
            <Link 
              to="/inventory" 
              className="block px-3 py-2 hover:bg-secondary rounded-md"
              onClick={toggleMobileMenu}
            >
              Inventaire
            </Link>
            <Link 
              to="/quests" 
              className="block px-3 py-2 hover:bg-secondary rounded-md"
              onClick={toggleMobileMenu}
            >
              Quêtes
            </Link>
            <Link 
              to="/versus" 
              className="block px-3 py-2 hover:bg-secondary rounded-md"
              onClick={toggleMobileMenu}
            >
              Combat PVP
            </Link>
            <Link 
              to="/board-game" 
              className="block px-3 py-2 hover:bg-secondary rounded-md"
              onClick={toggleMobileMenu}
            >
              Jeu de Plateau
            </Link>
            
            {user && (
              <div className="border-t border-gray-700 pt-2 mt-2">
                {activeCharacter && (
                  <div className="px-3 py-2">
                    <p className="text-sm opacity-75">Personnage actif:</p>
                    <p className="font-medium">{activeCharacter.name}</p>
                  </div>
                )}
                <Link
                  to="/character/profile"
                  className="block px-3 py-2 hover:bg-secondary rounded-md"
                  onClick={toggleMobileMenu}
                >
                  Profil du personnage
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                  className="flex items-center w-full text-left px-3 py-2 hover:bg-secondary rounded-md"
                >
                  <LogoutIcon className="h-4 w-4 mr-2" />
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

