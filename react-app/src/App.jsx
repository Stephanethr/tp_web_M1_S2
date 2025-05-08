// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CharacterProvider } from './context/CharacterContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages d'authentification
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Pages de personnages
import CharacterList from './pages/characters/CharacterList';
import CharacterDetail from './pages/characters/CharacterDetail';
import CreateCharacter from './pages/characters/CreateCharacter';

// Layout et pages communes
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// Pages à implémenter plus tard
const Inventory = () => <div>Page d'inventaire (à implémenter)</div>;
const VersusGame = () => <div>Mode Versus (à implémenter)</div>;
const QuestGame = () => <div>Mode Quête (à implémenter)</div>;
const BoardGame = () => <div>Jeu de Plateau (à implémenter)</div>;

const App = () => {
  return (
    <Router>
      <AuthProvider>
        {/* Wrap tout le contenu protégé dans CharacterProvider */}
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Routes protégées */}
          <Route element={<ProtectedRoute />}>
            <Route element={
              <CharacterProvider>
                <>
                  <Navbar />
                  <main className="pt-16 pb-8">
                    <Outlet />
                  </main>
                </>
              </CharacterProvider>
            }>
              <Route path="/" element={<Home />} />
              <Route path="/characters" element={<CharacterList />} />
              <Route path="/characters/create" element={<CreateCharacter />} />
              <Route path="/characters/:id" element={<CharacterDetail />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/game/versus" element={<VersusGame />} />
              <Route path="/game/quest" element={<QuestGame />} />
              <Route path="/game/board" element={<BoardGame />} />
            </Route>
          </Route>

          {/* Page 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;