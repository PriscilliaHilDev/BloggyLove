import React, { createContext, useState, useEffect } from 'react';
import { getUserData } from '../utils/userStorage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthentication = async () => {
    try {
      const userData = await getUserData();
      setIsAuthenticated(!!userData?.accessToken); // Assure un booléen.
    } catch (error) {
      console.error("Erreur lors de la vérification de l'authentification :", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    console.log("Utilisateur connecté : isAuthenticated =", true);
  };

  const logout = async () => {
    console.log("Déconnexion en cours...");
    setIsAuthenticated(false); // Mise à jour de l'état.
  };

  // Log pour observer les changements d'état.
  useEffect(() => {
    console.log("isAuthenticated a été mis à jour :", isAuthenticated);
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
