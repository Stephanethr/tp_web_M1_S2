import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, checkAuth } from '../api/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

// Dans votre AuthProvider ou composant racine
useEffect(() => {
  const verifyAuth = async () => {
    try {
      const authStatus = await checkAuth();
      if (authStatus.authenticated) {
        setUser(authStatus.user);
        setIsAuthenticated(true);
      } else {
        // L'utilisateur n'est pas authentifié
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Erreur de vérification d\'authentification:', error);
      // En cas d'erreur, considérer que l'utilisateur n'est pas authentifié
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false); // Indiquer que la vérification est terminée
    }
  };

  verifyAuth();
}, []);

  const login = async (email, password) => {
    try {
      const response = await apiLogin(email, password);
      if (response.success) {
        setUser(response.user);
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Une erreur s'est produite" };
    }
  };

  const register = async (email, username, password) => {
    try {
      const response = await apiRegister(email, username, password);
      if (response.success) {
        setUser(response.user);
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, message: "Une erreur s'est produite" };
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, message: "Une erreur s'est produite" };
    }
  };

  const updateCharacter = (character) => {
    if (user) {
      setUser({
        ...user,
        activeCharacter: character
      });
    }
  };

  const setIsAuthenticated = (isAuthenticated) => {
    if (user) {
      setUser({
        ...user,
        isAuthenticated: isAuthenticated
      });
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    updateCharacter,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
      {loading && (
        <div className="flex justify-center items-center h-screen">
          Chargement...
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};
