import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, RequireAuth } from './hooks/useAuth';
import Navbar from './components/navigation/Navbar';
import { GameProvider } from './contexts/GameContext';

// Import du composant de chargement
const LoadingSpinner = () => (
  <div className="h-screen flex justify-center items-center">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
  </div>
);

// Lazy loading des composants avec les noms corrects
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const CharactersPage = lazy(() => import('./pages/CharactersPage'));
const CharacterProfilePage = lazy(() => import('./pages/CharacterProfilePage'));
const CreateCharacterPage = lazy(() => import('./pages/CreateCharacterPage'));
const InventoryPage = lazy(() => import('./pages/InventoryPage'));
const QuestsPage = lazy(() => import('./pages/QuestsPage'));
const BattlePage = lazy(() => import('./pages/BattlePage'));
const BoardGamePage = lazy(() => import('./pages/BoardGamePage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <GameProvider>
        <div className="min-h-screen bg-gray-100 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Routes publiques */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Page d'accueil */}
                <Route path="/" element={
                  <RequireAuth>
                    <HomePage />
                  </RequireAuth>
                } />
                
                {/* Routes protégées par authentification */}
                <Route path="/characters" element={
                  <RequireAuth>
                    <CharactersPage />
                  </RequireAuth>
                } />
                
                <Route path="/characters/profile/:id" element={
                  <RequireAuth>
                    <CharacterProfilePage />
                  </RequireAuth>
                } />
                
                <Route path="/characters/create" element={
                  <RequireAuth>
                    <CreateCharacterPage />
                  </RequireAuth>
                } />
                
                <Route path="/inventory" element={
                  <RequireAuth>
                    <InventoryPage />
                  </RequireAuth>
                } />
                
                <Route path="/quests" element={
                  <RequireAuth>
                    <QuestsPage />
                  </RequireAuth>
                } />
                
                <Route path="/battle" element={
                  <RequireAuth>
                    <BattlePage />
                  </RequireAuth>
                } />
                
                <Route path="/board-game" element={
                  <RequireAuth>
                    <BoardGamePage />
                  </RequireAuth>
                } />
                
                {/* Route 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </main>
          <footer className="bg-gray-800 text-gray-300 py-4 text-center">
            <p>&copy; {new Date().getFullYear()} RPG Game App</p>
          </footer>
        </div>
        </GameProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;