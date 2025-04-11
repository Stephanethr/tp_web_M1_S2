import React from 'react';
import {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate, Link} from 'react-router-dom';
import api from './services/api';

// AUTH FILES
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// CHARACTER FILES
import CharacterCreation from './components/character/CharacterCreation';
import CharacterList from './components/character/CharacterList';
import CharacterProfile from './components/character/CharacterProfile';

// GAME FILES
import QuestMode from './components/game/QuestMode';
import VersusMode from './components/game/VersusMode';
import BoardGame from './components/game/BoardGame';

// INVENTORY FILES
import InventoryList from './components/inventory/InventoryList';
import ItemEditor from './components/inventory/ItemEditor';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated when the app loads
    const checkAuthStatus = async () => {
      try {
        const response = await api.get('/check-auth');
        if (response.data.authenticated) {
          setIsAuthenticated(true);
          setUser(response.data.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <Router>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"></link>
      <div className="App min-h-screen flex flex-col">
  {/* Navigation */}
  <nav className="bg-primary-500 text-white shadow-md">
    <div className="container mx-auto px-4 flex items-center justify-between py-4">
      <Link to="/" className="text-xl font-bold">
        Bonk RPG
      </Link>
      <button
        className="text-white md:hidden"
        type="button"
        aria-expanded="false"
        aria-label="Afficher le menu"
      >
        <span className="material-icons">menu</span>
      </button>
      {/* Navigation Links */}
      <div
        className={`md:flex md:items-center md:space-x-4`}
      >
        <ul className="flex flex-col md:flex-row md:space-x-4">
          {isAuthenticated ? (
            <>
              <li>
                <Link
                  to="/character-profile"
                  className="block px-4 py-2 text-white rounded hover:bg-primary-600"
                >
                  Mon Profil
                </Link>
              </li>
              <li>
                <Link
                  to="/characters"
                  className="block px-4 py-2 text-white rounded hover:bg-primary-600"
                >
                  Personnages
                </Link>
              </li>
              <li>
                <Link
                  to="/inventory"
                  className="block px-4 py-2 text-white rounded hover:bg-primary-600"
                >
                  Inventaire
                </Link>
              </li>
              <li className="group relative">
                <button
                  className="block px-4 py-2 text-white rounded hover:bg-primary-600"
                >
                  Jeux
                </button>
                <ul className="absolute hidden group-hover:block bg-white text-black shadow-md rounded mt-2">
                  <li>
                    <Link
                      to="/quests"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Mode Quête
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/versus"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Mode Versus
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/board-game"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Jeu de Plateau
                    </Link>
                  </li>
                </ul>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-white rounded hover:bg-primary-600"
                >
                  Connexion
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="block px-4 py-2 text-white rounded hover:bg-primary-600"
                >
                  Inscription
                </Link>
              </li>
            </>
          )}
        </ul>
        {isAuthenticated && user && (
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <span className="text-sm">Bonjour, {user.username}</span>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                api
                  .post("/logout")
                  .then(() => {
                    setIsAuthenticated(false);
                    setUser(null);
                  });
              }}
            >
              <button
                type="submit"
                className="px-4 py-2 text-sm text-primary-500 bg-white rounded hover:bg-gray-100"
              >
                Déconnexion
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  </nav>

  {/* Main Content */}
  <main className="container mx-auto px-4 flex-grow mt-6">
    <Routes>
      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <Login setAuth={setIsAuthenticated} setUser={setUser} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/register"
        element={
          !isAuthenticated ? (
            <Register setAuth={setIsAuthenticated} setUser={setUser} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      {/* Protected Routes */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/character-profile" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/create-character"
        element={
          isAuthenticated ? (
            <CharacterCreation />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/characters"
        element={
          isAuthenticated ? (
            <CharacterList />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/character-profile"
        element={
          isAuthenticated ? (
            <CharacterProfile />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/board-game"
        element={
          isAuthenticated ? (
            <BoardGame />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/quests"
        element={
          isAuthenticated ? (
            <QuestMode />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/versus"
        element={
          isAuthenticated ? (
            <VersusMode />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/inventory"
        element={
          isAuthenticated ? (
            <InventoryList />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/add-item"
        element={
          isAuthenticated ? (
            <ItemEditor isEditing={false} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/edit-item/:itemId"
        element={
          isAuthenticated ? (
            <ItemEditor isEditing={true} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="*"
        element={<div>Page non trouvée</div>}
      />
    </Routes>
  </main>

  {/* Footer */}
  <footer className="bg-primary-500 text-white text-center py-3 mt-6">
    <p className="text-sm">© 2023 Bonk RPG - Tous droits réservés</p>
  </footer>
</div>

    </Router>
  );
}

export default App;
