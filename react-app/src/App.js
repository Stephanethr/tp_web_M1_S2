import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CharactersPage from './pages/CharactersPage';
import CreateCharacterPage from './pages/CreateCharacterPage';
import CharacterDetailPage from './pages/CharacterDetailPage';
import InventoryPage from './pages/InventoryPage';
import QuestsPage from './pages/QuestPage';
import QuestDetailsPage from './components/quests/QuestDetailsPage';



// Composant de protection des routes pour les utilisateurs authentifiés
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Redirection si l'utilisateur est déjà connecté
const PublicRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }
  
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              
              <Route path="/login" element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } />
              
              <Route path="/register" element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              } />

              <Route path="/characters" element={
                <ProtectedRoute>
                  <CharactersPage />
                </ProtectedRoute>
              } />

              <Route path="/characters/create" element={
                <ProtectedRoute>
                  <CreateCharacterPage />
                </ProtectedRoute>
              } />

              <Route path="/characters/:id" element={
                <ProtectedRoute>
                  <CharacterDetailPage />
                </ProtectedRoute>
              } />

              <Route path="/inventory" element={
                <ProtectedRoute>
                  <InventoryPage />
                </ProtectedRoute>
              } />

              <Route path="/quests" element={
                <ProtectedRoute>
                  <QuestsPage />
                </ProtectedRoute>
              } />

              <Route path="/quests/:questId" element={
                <ProtectedRoute>
                  <QuestDetailsPage />
                </ProtectedRoute>
              } />
              
              {/* Routes protégées - à ajouter dans le futur */}
              {/* 
              <Route path="/characters" element={
                <ProtectedRoute>
                  <CharactersPage />
                </ProtectedRoute>
              } />
              
              <Route path="/inventory" element={
                <ProtectedRoute>
                  <InventoryPage />
                </ProtectedRoute>
              } />
              
              <Route path="/quests" element={
                <ProtectedRoute>
                  <QuestsPage />
                </ProtectedRoute>
              } /> 
              */}
              
              {/* Route 404 */}
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center h-screen">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                  <p className="text-xl text-gray-600 mb-8">Page non trouvée</p>
                  <a href="/" className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
                    Retour à l'accueil
                  </a>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
