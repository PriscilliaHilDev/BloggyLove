import EncryptedStorage from 'react-native-encrypted-storage'; // Import de EncryptedStorage pour un stockage sécurisé

// Fonction pour effacer les données utilisateur
export const clearUserData = async () => {
  try {
    await EncryptedStorage.removeItem('user');
    await EncryptedStorage.removeItem('auth_source');
    await EncryptedStorage.removeItem('accessToken');
    await EncryptedStorage.removeItem('refreshToken');
    console.log('Données utilisateur supprimées avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'effacement des données utilisateur', error);
  }
};

// Fonction pour sauvegarder les données utilisateur de manière sécurisée
export const saveUserData = async (user, authSource, accessToken, refreshToken) => {
  try {
    // Vérification de la validité des données avant de les sauvegarder
    if (!user || !accessToken || !refreshToken) {
      throw new Error('Données utilisateur manquantes');
    }

    // Si 'user' est déjà une chaîne JSON, ne pas essayer de le convertir
    const userData = typeof user === 'string' ? user : JSON.stringify(user);
    console.log('tototot', userData)

    // Sauvegarder les données
    await EncryptedStorage.setItem('user', userData);
    await EncryptedStorage.setItem('auth_source', authSource);
    await EncryptedStorage.setItem('accessToken', accessToken);
    await EncryptedStorage.setItem('refreshToken', refreshToken);

    console.log('Données utilisateur sauvegardées avec succès');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des données utilisateur:', error);
  }
};

// Fonction pour récupérer les données utilisateur
export const getUserData = async () => {
  try {
    // Récupération des données stockées
    const user = await EncryptedStorage.getItem('user');
    const authSource = await EncryptedStorage.getItem('auth_source');
    const accessToken = await EncryptedStorage.getItem('accessToken');
    const refreshToken = await EncryptedStorage.getItem('refreshToken');

    // Vérification si toutes les données nécessaires sont présentes
    if (!user || !authSource || !accessToken || !refreshToken) {
      console.error('Certaines données sont manquantes');
      return null;
    }

    // Parsing du JSON pour l'utilisateur
    const parsedUser = JSON.parse(user);

    // Retourner les données sous forme d'objet
    return {
      user: parsedUser,
      authSource,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateur:', error);
    return null;
  }
};
