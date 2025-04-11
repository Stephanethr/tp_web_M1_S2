import InventoryList from './components/inventory/InventoryList';
import ItemEditor from './components/inventory/ItemEditor';
import { useState, useEffect } from 'react';
import api from './services/api';
import './styles/game.css';

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
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
          <div className="container">
            <Link className="navbar-brand" to="/">Bonk RPG</Link>
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto">
                {isAuthenticated ? (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/character-profile">Mon Profil</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/characters">Personnages</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/inventory">Inventaire</Link>
                    </li>
                    <li className="nav-item dropdown">
                      <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                        Jeux
                      </a>
                      <ul className="dropdown-menu">
                        <li><Link className="dropdown-item" to="/quests">Mode Quête</Link></li>
                        <li><Link className="dropdown-item" to="/versus">Mode Versus</Link></li>
                        <li><Link className="dropdown-item" to="/board-game">Jeu de Plateau</Link></li>
                      </ul>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/login">Connexion</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/register">Inscription</Link>
                    </li>
                  </>
                )}
              </ul>
              
              {isAuthenticated && user && (
                <div className="d-flex">
                  <span className="navbar-text me-3">
                    Bonjour, {user.username}
                  </span>
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      api.post('/logout')
                        .then(() => {
                          setIsAuthenticated(false);
                          setUser(null);
                        });
                    }}
                  >
                    <button type="submit" className="btn btn-outline-light btn-sm">
                      Déconnexion
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </nav>

        <div className="container mt-3">
          <Routes>
            <Route path="/login" element={
              !isAuthenticated ? <Login setAuth={setIsAuthenticated} setUser={setUser} /> : <Navigate to="/" />
            } />
            <Route path="/register" element={
              !isAuthenticated ? <Register setAuth={setIsAuthenticated} setUser={setUser} /> : <Navigate to="/" />
            } />
            
            {/* Protected routes */}
            <Route path="/" element={
              isAuthenticated ? <Navigate to="/character-profile" /> : <Navigate to="/login" />
            } />
            
            <Route path="/create-character" element={
              isAuthenticated ? <CharacterCreation /> : <Navigate to="/login" />
            } />
            
            <Route path="/characters" element={
              isAuthenticated ? <CharacterList /> : <Navigate to="/login" />
            } />
            
            <Route path="/character-profile" element={
              isAuthenticated ? <CharacterProfile /> : <Navigate to="/login" />
            } />
            
            <Route path="/board-game" element={
              isAuthenticated ? <BoardGame /> : <Navigate to="/login" />
            } />
            
            <Route path="/quests" element={
              isAuthenticated ? <QuestMode /> : <Navigate to="/login" />
            } />
            
            <Route path="/versus" element={
              isAuthenticated ? <VersusMode /> : <Navigate to="/login" />
            } />
            
            <Route path="/fight-result" element={
              isAuthenticated ? <FightResult /> : <Navigate to="/login" />
            } />
            
            <Route path="/inventory" element={
              isAuthenticated ? <InventoryList /> : <Navigate to="/login" />
            } />
            
            <Route path="/add-item" element={
              isAuthenticated ? <ItemEditor isEditing={false} /> : <Navigate to="/login" />
            } />
            
            <Route path="/edit-item/:itemId" element={
              isAuthenticated ? <ItemEditor isEditing={true} /> : <Navigate to="/login" />
            } />
            
            <Route path="*" element={<div>Page non trouvée</div>} />
          </Routes>
        </div>
        
        <footer className="bg-primary text-white text-center py-3 mt-5">
          <div className="container">
            <p className="mb-0">© 2023 Bonk RPG - Tous droits réservés</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
