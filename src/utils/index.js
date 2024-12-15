import { Alert } from 'react-native';

/**
 * Affiche une alerte générique avec un titre et un message.
 * 
 * @param {string} title - Le titre de l'alerte (par exemple 'Succès' ou 'Erreur').
 * @param {string} message - Le message à afficher dans l'alerte.
 * @param {function} onPressOk - La fonction à appeler lorsque l'utilisateur appuie sur le bouton 'OK'.
 */
export const showAlert = (title, message, onPressOk) => {
  Alert.alert(
    title,  // Titre de l'alerte
    message,  // Message de l'alerte
    [
      {
        text: 'OK',  // Texte du bouton
        onPress: onPressOk,  // Fonction à exécuter à la pression du bouton
      },
    ]
  );
};