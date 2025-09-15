// src/services/authService.js
import { authorize } from 'react-native-app-auth';
import { saveUserData, clearUserData, getUserData } from '../utils/userStorage';
import api from '../secureApiRequest';
import { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URL } from '@env';

// ---- Config OAuth Google (doit correspondre à ton scheme/redirect natif)
const config = {
  issuer: 'https://accounts.google.com',
  clientId: GOOGLE_CLIENT_ID,
  redirectUrl: GOOGLE_REDIRECT_URL,
  scopes: ['openid', 'profile', 'email'],
  usePKCE: true,
};

// ---- Helper: récupérer un id quel que soit le nom de clé
const getUserId = (u) => u?.id ?? u?._id ?? u?.userId ?? null;

// ----------------- ACTIONS -----------------

// Déconnexion (fail-safe) : on tente l’API, mais on nettoie local quoi qu’il arrive
export const logoutUser = async () => {
  try {
    const u = await getUserData();
    const userId = getUserId(u?.user);
    if (userId) {
      try { await api.post('/logout', { userId }); } catch { /* ignore */ }
    }
  } finally {
    await clearUserData();
  }
  return { success: true, message: 'Vous êtes déconnecté !' };
};

// Google Login
export const googleLogin = async () => {
  try {
    const authState = await authorize(config); // ouvre le flux Google
    const { idToken, accessToken } = authState;

    const response = await api.post('/google-login', { idToken, accessToken });
    const tokens = response?.data?.tokens;
    const user = response?.data?.user;

    if (tokens?.accessToken && tokens?.refreshToken && user) {
      await saveUserData(user, 'google', tokens.accessToken, tokens.refreshToken);
      return { success: true, data: { user } };
    }
    return { success: false, message: response?.data?.message || 'Réponse de connexion Google incomplète.' };
  } catch (error) {
    if (String(error?.message || '').includes('User cancelled flow')) {
      return { success: false, silent: true }; // pas d’alerte si l’utilisateur annule
    }
    console.error('Erreur Google Login:', error);
    return { success: false, message: 'Impossible de se connecter avec Google.' };
  }
};

// Login (email/mot de passe)
export const loginUser = async ({ email, password }) => {
  try {
    const response = await api.post('/login', { email, password });
    const tokens = response?.data?.tokens;
    const user = response?.data?.user;

    if (tokens?.accessToken && tokens?.refreshToken && user) {
      await saveUserData(user, 'form', tokens.accessToken, tokens.refreshToken);
      return { success: true, data: { user } };
    }
    return { success: false, message: response?.data?.message || 'Identifiants invalides ou réponse incomplète.' };
  } catch (error) {
    const apiMsg = error?.response?.data?.message;
    console.error('Erreur loginUser:', error);
    return { success: false, message: apiMsg || 'Une erreur est survenue pendant la connexion.' };
  }
};

// Register (inscription)
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    const tokens = response?.data?.tokens;
    const user = response?.data?.user;

    if (tokens?.accessToken && tokens?.refreshToken && user) {
      await saveUserData(user, 'form', tokens.accessToken, tokens.refreshToken);
      return { success: true, data: { user } };
    }
    return { success: false, message: response?.data?.message || "Réponse d'inscription incomplète." };
  } catch (error) {
    const apiMsg = error?.response?.data?.message;
    console.error('Erreur registerUser:', error);
    return { success: false, message: apiMsg || "Impossible d'effectuer l'inscription. Vérifie ta connexion." };
  }
};

// Mot de passe oublié
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/forgot-password', { email });
    const ok = response?.status >= 200 && response?.status < 300;
    return ok
      ? { success: true, message: 'Un e-mail de réinitialisation a été envoyé.' }
      : { success: false, message: response?.data?.message || "Erreur lors de l'envoi de l'e-mail." };
  } catch (error) {
    console.error('Erreur forgotPassword:', error);
    return { success: false, message: 'Impossible de traiter votre demande.' };
  }
};

// Réinitialisation de mot de passe
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post(`/reset-password/${token}`, { password: newPassword });
    const ok = response?.status >= 200 && response?.status < 300;
    return ok
      ? { success: true, message: 'Votre mot de passe a été réinitialisé avec succès.' }
      : { success: false, message: response?.data?.message || 'Erreur lors de la réinitialisation du mot de passe.' };
  } catch (error) {
    const apiMsg = error?.response?.data?.message;
    console.error('Erreur resetPassword:', error);
    return { success: false, message: apiMsg || 'Impossible de réinitialiser votre mot de passe.' };
  }
};
