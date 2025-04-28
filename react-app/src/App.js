import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CharacterCreate from './pages/CharacterCreate';
import CharacterList from './pages/CharacterList';
import CharacterProfile from './pages/CharacterProfile';
import Inventory from './pages/Inventory';
import EditItem from './pages/EditItem';
import QuestMode from './pages/QuestMode';
import QuestDetails from './pages/QuestDetails';
import VersusMode from './pages/VersusMode';
import FightResult from './pages/FightResult';
import BoardGame from './pages/BoardGame';

// Route protégée qui redirige vers la connexion si non authentifié
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg className="animate-spin h-10 w-10 text-accent" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Navbar />
          <main className="pt-16 pb-8">
            <Routes>
              {/* Routes publiques */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Routes protégées */}
              <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
              
              {/* Routes des personnages */}
              <Route path="/characters" element={<PrivateRoute><CharacterList /></PrivateRoute>} />
              <Route path="/character/create" element={<PrivateRoute><CharacterCreate /></PrivateRoute>} />
              <Route path="/character/profile" element={<PrivateRoute><CharacterProfile /></PrivateRoute>} />
              
              {/* Routes de l'inventaire */}
              <Route path="/inventory" element={<PrivateRoute><Inventory /></PrivateRoute>} />
              <Route path="/add_item" element={<PrivateRoute><EditItem action="add" /></PrivateRoute>} />
              <Route path="/edit/:itemId" element={<PrivateRoute><EditItem action="edit" /></PrivateRoute>} />
              
              {/* Routes des modes de jeu */}
              <Route path="/quests" element={<PrivateRoute><QuestMode /></PrivateRoute>} />
              <Route path="/quest/:questId" element={<PrivateRoute><QuestDetails /></PrivateRoute>} />
              <Route path="/versus" element={<PrivateRoute><VersusMode /></PrivateRoute>} />
              <Route path="/fight/result" element={<PrivateRoute><FightResult /></PrivateRoute>} />
              <Route path="/board-game" element={<PrivateRoute><BoardGame /></PrivateRoute>} />
              
              {/* Fallback pour les routes inconnues */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} RPG Game. Tous droits réservés.
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;