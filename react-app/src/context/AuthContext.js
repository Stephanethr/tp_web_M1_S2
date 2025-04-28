import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, checkAuth } from '../api/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await checkAuth();
        if (userData.success) {
          setUser(userData.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
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
