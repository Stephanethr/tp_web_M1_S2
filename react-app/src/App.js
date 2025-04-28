import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated, logout } from './api/apiService';
import Navbar from './components/Navbar';

// Pages d'authentification
import Login from './pages/Login';
import Register from './pages/Register';

// Pages du jeu
import Dashboard from './pages/Dashboard';
import CharacterList from './pages/CharacterList';
import CharacterProfile from './pages/CharacterProfile';
import CreateCharacter from './pages/CreateCharacter';
import Inventory from './pages/Inventory';
import VersusMode from './pages/VersusMode';
import FightResult from './pages/FightResult';
import QuestMode from './pages/QuestMode';
import QuestResult from './pages/QuestResult';
import BoardGame from './pages/BoardGame';

// Contexte global pour l'authentification
import { AuthProvider } from './context/AuthContext';

// HOC pour protéger les routes privées
const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isAuthenticated();
      setAuthenticated(auth);
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  return authenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Navbar />
          
          <main className="pt-16">
            <Routes>
              {/* Routes publiques */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Routes privées */}
              <Route 
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/characters"
                element={
                  <PrivateRoute>
                    <CharacterList />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/character/profile"
                element={
                  <PrivateRoute>
                    <CharacterProfile />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/character/create"
                element={
                  <PrivateRoute>
                    <CreateCharacter />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/inventory"
                element={
                  <PrivateRoute>
                    <Inventory />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/versus"
                element={
                  <PrivateRoute>
                    <VersusMode />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/fight-result"
                element={
                  <PrivateRoute>
                    <FightResult />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/quests"
                element={
                  <PrivateRoute>
                    <QuestMode />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/quest-result"
                element={
                  <PrivateRoute>
                    <QuestResult />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/board-game"
                element={
                  <PrivateRoute>
                    <BoardGame />
                  </PrivateRoute>
                } 
              />
              
              {/* Redirection pour toutes les autres routes */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
