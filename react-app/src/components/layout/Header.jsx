import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Button from '../common/Button';

function Header() {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold">RPG Game</Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-4">
              {currentUser && (
                <>
                  <li>
                    <Link to="/" className="px-3 py-2 rounded-md hover:bg-gray-700">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/characters" className="px-3 py-2 rounded-md hover:bg-gray-700">
                      Characters
                    </Link>
                  </li>
                  <li>
                    <Link to="/inventory" className="px-3 py-2 rounded-md hover:bg-gray-700">
                      Inventory
                    </Link>
                  </li>
                  <li>
                    <Link to="/quests" className="px-3 py-2 rounded-md hover:bg-gray-700">
                      Quests
                    </Link>
                  </li>
                  <li>
                    <Link to="/versus" className="px-3 py-2 rounded-md hover:bg-gray-700">
                      Versus
                    </Link>
                  </li>
                  <li>
                    <Link to="/board-game" className="px-3 py-2 rounded-md hover:bg-gray-700">
                      Board Game
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* User Menu */}
          <div className="hidden md:block">
            {currentUser ? (
              <div className="flex items-center">
                <span className="mr-4">{currentUser.username}</span>
                <Button onClick={handleLogout} variant="light" size="sm">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link to="/login">
                  <Button variant="light" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {currentUser && (
            <>
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/characters"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Characters
              </Link>
              <Link
                to="/inventory"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Inventory
              </Link>
              <Link
                to="/quests"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Quests
              </Link>
              <Link
                to="/versus"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Versus
              </Link>
              <Link
                to="/board-game"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Board Game
              </Link>
            </>
          )}
        </div>

        <div className="pt-4 pb-3 border-t border-gray-700">
          {currentUser ? (
            <div className="px-5 space-y-3">
              <div className="text-base font-medium">{currentUser.username}</div>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-gray-600 hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="px-5 py-3 space-y-2">
              <Link
                to="/login"
                className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-white bg-gray-600 hover:bg-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;