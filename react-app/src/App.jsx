import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CharacterProvider } from './context/CharacterContext';
import { InventoryProvider } from './context/InventoryContext';
import Navbar from './components/layout/Navbar';

// Import des composants avec exports par défaut
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CharacterList from './pages/characters/CharacterList';
import CreateCharacter from './pages/characters/CreateCharacter';
import CharacterDetail from './pages/characters/CharacterDetail';
import InventoryPage from './pages/inventory/InventoryPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CharacterProvider>
          <InventoryProvider>
            <div className="min-h-screen bg-gray-50">
              <Navbar />

              <Routes>
                {/* Page d'accueil */}
                <Route path="/" element={
                  <div className="container mx-auto px-4 py-8">
                    <Home />
                  </div>
                } />

                {/* Authentification */}
                <Route path="/login" element={
                  <div className="container mx-auto px-4 py-8">
                    <Login />
                  </div>
                } />

                <Route path="/register" element={
                  <div className="container mx-auto px-4 py-8">
                    <Register />
                  </div>
                } />

                {/* Personnages */}
                <Route path="/characters">
                  <Route index element={
                    <div className="container mx-auto px-4 py-8">
                      <CharacterList />
                    </div>
                  } />
                  <Route path="new" element={
                    <div className="container mx-auto px-4 py-8">
                      <CreateCharacter />
                    </div>
                  } />
                  <Route path=":id" element={
                    <div className="container mx-auto px-4 py-8">
                      <CharacterDetail />
                    </div>
                  } />
                </Route>

                {/* Inventaire */}
                <Route path="/inventory" element={
                  <div className="container mx-auto px-4 py-8">
                    <InventoryPage />
                  </div>
                } />

                {/* 404 */}
                <Route path="*" element={
                  <div className="container mx-auto px-4 py-8">
                    <NotFound />
                  </div>
                } />
              </Routes>
            </div>
          </InventoryProvider>
        </CharacterProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;