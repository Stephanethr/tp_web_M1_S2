import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import apiService from '../services/apiService';
import { useNavigate } from 'react-router-dom';

// Créer un contexte d'authentification
const AuthContext = createContext(null);

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Fournisseur du contexte d'authentification
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vérifier si l'utilisateur est déjà authentifié (lors du chargement)
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await apiService.getCurrentUser();
        if (response && response.data && response.data.user) {
          setUser(response.data.user);
        }
      } catch (err) {
        console.log('User not authenticated', err);
        // Ne pas définir d'erreur ici pour éviter les messages d'erreur au chargement initial
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Connexion utilisateur
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.login(email, password);
      if (response && response.data && response.data.user) {
        setUser(response.data.user);
        return { success: true };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Inscription utilisateur
  const register = useCallback(async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.register(username, email, password);
      if (response && response.data && response.data.user) {
        setUser(response.data.user);
        return { success: true };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Déconnexion utilisateur
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await apiService.logout();
      setUser(null);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to logout. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Mise à jour du profil utilisateur
  const updateUserProfile = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.updateUserProfile(userData);
      if (response && response.data && response.data.user) {
        setUser(response.data.user);
        return { success: true };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Changement de mot de passe
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.changePassword(currentPassword, newPassword);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to change password. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Réinitialisation des erreurs
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Vérifier si l'utilisateur est connecté
  const isAuthenticated = !!user;

  // Valeur du contexte d'authentification
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUserProfile,
    changePassword,
    clearError,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Composant de protection de route (nécessite une authentification)
export function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);
  
  if (loading) {
    return <div className="h-screen flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>;
  }
  
  return isAuthenticated ? children : null;
}

export default useAuth;