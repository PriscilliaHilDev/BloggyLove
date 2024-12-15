import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import { saveUserData, getUserData } from '../utils/userStorage';
import {API_BASE_URL} from '@env';

// Crée une instance d'Axios avec une URL de base pour toutes les requêtes
const api = axios.create({
  baseURL: API_BASE_URL, 
});

// Fonction pour rafraîchir le token d'accès
export const refreshAccessToken = async (refreshToken) => {
  try {
    // Envoie une requête POST à l'endpoint `/refresh-token` avec le refreshToken
    const response = await api.post('/refresh-token', { refreshToken });

    // Si la réponse est réussie (statut HTTP 200)
    if (response.status === 200) {
      const { accessToken, refreshToken: newRefreshToken } = response.data;

      // Récupère les données utilisateur stockées pour les mettre à jour avec les nouveaux tokens
      const currentUserData = await getUserData();

      if (currentUserData) {
        const { user, authSource } = currentUserData;

        // Met à jour et sauvegarde les nouveaux tokens avec les données utilisateur existantes
        await saveUserData(user, authSource, accessToken, newRefreshToken);
      } else {
        throw new Error('Données utilisateur introuvables pour la mise à jour');
      }

      console.log('Tokens mis à jour avec succès');
      return accessToken; // Retourne le nouveau token d'accès
    } else {
      throw new Error('Impossible de renouveler le token');
    }
  } catch (error) {
    // Affiche une erreur en cas d'échec de la requête de rafraîchissement du token
    console.error('Erreur lors du rafraîchissement du token :', error);
    return null; // Retourne `null` en cas d'erreur
  }
};

// Intercepteur de requêtes : Ajoute automatiquement le token d'accès dans les en-têtes
api.interceptors.request.use(
  async (config) => {
    // Récupère le token d'accès depuis EncryptedStorage
    const accessToken = await EncryptedStorage.getItem('accessToken');
    if (accessToken) {
      // Ajoute le token dans l'en-tête `Authorization`
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config; // Retourne la configuration modifiée
  },
  (error) => {
    // Gestion des erreurs sur les requêtes avant qu'elles soient envoyées
    return Promise.reject(error);
  }
);

// Intercepteur de réponses : Gère l'expiration du token (erreur 401)
api.interceptors.response.use(
  (response) => response, // Retourne la réponse directement si aucune erreur n'est détectée
  async (error) => {
    const originalRequest = error.config;

    // Vérifie si l'erreur est une erreur 401 (non autorisée) et que la requête n'a pas déjà été réessayée
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marque la requête comme ayant déjà été réessayée

      // Récupère le refreshToken depuis EncryptedStorage
      const refreshToken = await EncryptedStorage.getItem('refreshToken');

      if (refreshToken) {
        // Tente de rafraîchir le token d'accès
        const newAccessToken = await refreshAccessToken(refreshToken);

        if (newAccessToken) {
          // Met à jour le token d'accès dans EncryptedStorage et réessaye la requête d'origine
          await EncryptedStorage.setItem('accessToken', newAccessToken);
          originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
          return api(originalRequest); // Réessaye la requête avec le nouveau token
        }
      }
    }

    // Si le rafraîchissement échoue ou si l'erreur est autre qu'une 401, rejette l'erreur
    return Promise.reject(error);
  }
);

export default api; // Exporte l'instance Axios avec les intercepteurs configurés