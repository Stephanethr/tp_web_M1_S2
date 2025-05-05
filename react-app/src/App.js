import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CharactersPage from './pages/CharactersPage';
import CharacterProfilePage from './pages/CharacterProfilePage';
import InventoryPage from './pages/InventoryPage';
import QuestsPage from './pages/QuestsPage';
import VersusPage from './pages/VersusPage';
import BoardGamePage from './pages/BoardGamePage';
import NotFoundPage from './pages/NotFoundPage';
import BattlePage from './pages/BattlePage';

// Layout
import Layout from './components/layout/Layout';

function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/" element={<HomePage />} />
              <Route path="/characters" element={<CharactersPage />} />
              <Route path="/characters/:id" element={<CharacterProfilePage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/quests" element={<QuestsPage />} />
              <Route path="/versus" element={<VersusPage />} />
              <Route path="/board-game" element={<BoardGamePage />} />
              <Route path="/battle" element={<BattlePage />} />
            </Route>
            
            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </GameProvider>
    </AuthProvider>
  );
}

export default App;