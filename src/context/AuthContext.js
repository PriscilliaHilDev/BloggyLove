// src/context/AuthContext.js
import React, { createContext, useEffect, useMemo, useState } from 'react';
import { getUserData, clearUserData } from '../utils/userStorage';
import { loginUser, registerUser, googleLogin, logoutUser } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);

  // Hydrate l'état depuis le storage sécurisé
  const hydrateFromStorage = async () => {
    try {
      const data = await getUserData(); // { user, accessToken, refreshToken, authSource } | null
      setIsAuthenticated(!!data?.accessToken);
      setUser(data?.user ?? null);
      setAuthError(null);
    } catch (e) {
      console.error('hydrateFromStorage error:', e);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    hydrateFromStorage();
  }, []);

  // -------- Actions d'auth --------

  // Login email / mot de passe
  const login = async (email, password) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await loginUser({ email, password });
      if (res?.success) {
        await hydrateFromStorage();
        return { ok: true };
      }
      const msg = res?.message || 'Identifiants invalides.';
      setAuthError(msg);
      return { ok: false, error: msg };
    } catch (e) {
      console.error('login() error:', e);
      const msg = 'Erreur réseau/serveur pendant la connexion.';
      setAuthError(msg);
      return { ok: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  // Inscription
  const register = async ({ name, email, password }) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await registerUser({ name, email, password });
      if (res?.success) {
        await hydrateFromStorage();
        return { ok: true };
      }
      const msg = res?.message || "Erreur lors de l'inscription.";
      setAuthError(msg);
      return { ok: false, error: msg };
    } catch (e) {
      console.error('register() error:', e);
      const msg = 'Erreur réseau/serveur pendant inscription.';
      setAuthError(msg);
      return { ok: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  // Login via Google
  const loginWithGoogle = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await googleLogin();
      if (res?.success) {
        await hydrateFromStorage();
        return { ok: true };
      }
      // si l’utilisateur annule, on renvoie un “silent”
      if (res?.silent) return { ok: false, silent: true };
      const msg = res?.message || 'Connexion Google refusée.';
      setAuthError(msg);
      return { ok: false, error: msg };
    } catch (e) {
      console.error('loginWithGoogle() error:', e);
      const msg = 'Erreur Google Login.';
      setAuthError(msg);
      return { ok: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  // Déconnexion (fail-safe : on nettoie quoi qu’il arrive)
  const logout = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await logoutUser().catch(() => {}); // on tente l’API, on ignore si ça échoue
    } finally {
      await clearUserData();
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
    }
  };

  // Re-sync depuis le storage (utile après un update profil)
  const refreshSession = async () => {
    setIsLoading(true);
    await hydrateFromStorage();
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      user,
      authError,
      setAuthError,
      login,            // (email, password)
      register,         // ({ name, email, password })
      loginWithGoogle,  // ()
      logout,           // ()
      refreshSession,   // ()
    }),
    [isAuthenticated, isLoading, user, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
