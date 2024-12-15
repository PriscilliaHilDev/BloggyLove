import { authorize } from 'react-native-app-auth';
import { saveUserData, clearUserData, getUserData } from '../utils/userStorage';
import api from '../secureApiRequest';
import { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URL } from '@env'; // Importer les variables d'environnement pour l'OAuth Google



// Configuration OAuth Google avec les paramètres provenant des variables d'environnement
const config = {
  issuer: "https://accounts.google.com",
  clientId: GOOGLE_CLIENT_ID,
  redirectUrl: GOOGLE_REDIRECT_URL,
  scopes: ['openid', 'profile', 'email'], // Définir les autorisations requises pour l'authentification
  usePKCE: true, // Utilisation de PKCE pour renforcer la sécurité lors de l'authentification
};



// Fonction pour gérer la déconnexion et supprimer les données utilisateur
export const logoutUser = async () => {
  try {
    // Récupérer les données utilisateur directement dans la fonction
    const userData = await getUserData();

    if (!userData || !userData.user || !userData.user.id) {
      return { success: false, message: 'Aucun utilisateur connecté.' }; // Vérification si l'utilisateur est connecté
    }

    const userId = userData.user.id;

    // Appel de l'API de déconnexion du back-end
    const response = await api.post('/logout', { userId });

    // Vérifier la réponse du serveur
    if (response.status === 200) {
      // Effacer les données utilisateur localement
      await clearUserData();
      return { success: true, message: 'Vous êtes déconnecté !' }; // Réponse de succès
    } else {
      return { success: false, message: response.data.message || 'Erreur lors de la déconnexion.' };
    }
  } catch (error) {
    if (error.response) {
      console.error('Erreur de l\'API:', error.response.data);
      return { success: false, message: error.response.data.message || 'Erreur lors de la déconnexion.' };
    } else if (error.request) {
      console.error('Aucune réponse du serveur:', error.request);
      return { success: false, message: 'Impossible de se connecter au serveur.' };
    } else {
      console.error('Erreur inconnue:', error.message);
      return { success: false, message: 'Une erreur inconnue est survenue.' };
    }
  }
};


// Fonction pour gérer la connexion via Google OAuth
export const googleLogin = async () => {
  try {
    // Authentification avec Google via OAuth
    const authState = await authorize(config); // Appel à la méthode `authorize` qui renvoie les tokens d'authentification
    const { idToken, accessToken } = authState; // Extraction des tokens nécessaires

    // Envoi des tokens à l'API backend pour validation et traitement
    const response = await api.post('/google-login', {
      idToken,
      accessToken, // Le accessToken pourrait être optionnel selon l'API
    });

    // Vérification de la réponse du backend
    if (response.status === 200) {
      const { tokens, user } = response.data; // Extraction des informations utilisateur et des tokens
      const { refreshToken, accessToken: newAccessToken } = tokens;

      // Sauvegarder les données utilisateur de manière sécurisée
      await saveUserData(user, 'google', newAccessToken, refreshToken);

      return { success: true, message: 'Vous êtes connecté !' }; // Retourner une réponse indiquant une connexion réussie
    } else {
      // Si la réponse est incorrecte
      return { success: false, message: response.data.message || 'Erreur lors de la connexion.' };
    }
  } catch (error) {
    // Gestion des erreurs spécifiques, comme si l'utilisateur annule la demande d'authentification
    if (error.message.includes('User cancelled flow')) {
      return { success: false, silent: true }; // Réponse silencieuse si l'utilisateur annule le flux
    }
    console.error('Erreur lors de la connexion avec Google:', error);
    return { success: false, message: 'Impossible de se connecter avec Google.' }; // Retourner un message d'erreur générique
  }
};

// Fonction pour gérer la connexion avec un email et mot de passe
export const loginUser = async (credentials) => {
  try {
    // Envoi des informations d'authentification à l'API backend
    const response = await api.post("/login", {
      email: credentials.email,
      password: credentials.password,
    });

    // Vérification de la réponse pour s'assurer que l'utilisateur est bien connecté
    if (response.status === 200) {
      const { tokens, user } = response.data; // Extraction des tokens et des informations utilisateur
      console.log(user , 'userr')
      const { accessToken, refreshToken } = tokens;

      // Sauvegarde des données utilisateur
      await saveUserData(user, 'form', accessToken, refreshToken);

      console.log('Utilisateur connecté avec succès');
      return { success: true, data: response.data }; // Retourner les données de l'utilisateur
    } else {
      console.error('Statut HTTP inattendu:', response.status);
      return { success: false, message: 'Erreur lors de la connexion' };
    }
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Une erreur est survenue', // Gestion des erreurs avec message personnalisé
    };
  }
};

// Fonction pour enregistrer un utilisateur
export const registerUser = async (userData) => {
  try {
    // Envoi des informations d'inscription à l'API backend
    const response = await api.post("/register", userData);

    // Vérification du statut HTTP pour confirmer que l'utilisateur a bien été créé
    if (response.status === 200) {
      const { tokens, user } = response.data; // Récupération des tokens et de l'utilisateur
      const { accessToken, refreshToken } = tokens;

      // Sauvegarder les données utilisateur
      await saveUserData(user, 'form', accessToken, refreshToken);
      return { success: true, data: response.data }; // Retourner les données d'inscription
    } else {
      console.error('Statut HTTP inattendu:', response.status);
      return { success: false, message: 'Erreur lors de l’inscription' };
    }
  } catch (error) {
    console.error('Erreur lors de l’inscription:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Une erreur est survenue',
    };
  }
};

// Fonction pour demander la réinitialisation du mot de passe
export const forgotPassword = async (email) => {
  try {
    // Envoi de la demande de réinitialisation à l'API backend
    const response = await api.post("/forgot-password", { email });

    // Vérification de la réponse pour confirmer que l'e-mail a été envoyé
    if (response.status === 200) {
      console.log('E-mail de réinitialisation envoyé');
      return { success: true, message: 'Un e-mail de réinitialisation a été envoyé.' }; // Confirmation de l'envoi de l'e-mail
    } else {
      return { success: false, message: response.data.message || 'Erreur lors de l\'envoi de l\'e-mail de réinitialisation.' };
    }
  } catch (error) {
    console.error('Erreur lors de la demande de réinitialisation de mot de passe:', error);
    return { success: false, message: 'Impossible de traiter votre demande.' };
  }
};

// Fonction pour gérer la réinitialisation du mot de passe
export const resetPassword = async (token, newPassword) => {
  console.log('token reçu', token); // Affichage du token pour débogage
  try {
    // Envoi de la requête POST avec le token et le mot de passe
    const response = await api.post(`/reset-password/${token}`, { password: newPassword });
    console.log('réponse', response); // Affichage de la réponse pour débogage

    if (response.status === 200) {
      console.log('Mot de passe réinitialisé avec succès');
      return { success: true, message: 'Votre mot de passe a été réinitialisé avec succès.' }; // Réponse de succès
    } else {
      console.error('Statut HTTP inattendu:', response.status);
      return { success: false, message: response.data.message || 'Erreur lors de la réinitialisation du mot de passe.' };
    }
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Impossible de réinitialiser votre mot de passe.',
    };
  }
};
