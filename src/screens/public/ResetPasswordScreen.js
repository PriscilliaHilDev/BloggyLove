import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { resetPassword, logoutUser } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';
import { showAlert } from '../../utils';  // Importation de showAlert

const ResetPasswordScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { logout, isAuthenticated } = useContext(AuthContext);

  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(false);

  const passwordVisibilityIcon = passwordVisibility ? '👁️' : '🙈';
  const confirmPasswordVisibilityIcon = confirmPasswordVisibility ? '👁️' : '🙈';

  const [token, setToken] = useState(route.params?.token || null);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTokenProcessed, setIsTokenProcessed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Nouvelle variable pour la déconnexion
  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  // Fonction pour basculer la visibilité des mots de passe
  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisibility(!confirmPasswordVisibility);
  };

  useEffect(() => {
    const handleUrl = async (event) => {
      setIsProcessing(true);
      if (isTokenProcessed) return;

      const urlParts = event.url.split('/reset-password/');
      if (urlParts.length > 1) {
        const tokenFromUrl = urlParts[1];
        if (tokenFromUrl && tokenFromUrl.trim() !== '') {
          setToken(tokenFromUrl);
          setIsTokenProcessed(true);
        } else {
          showAlert('Erreur', 'Le token de réinitialisation est vide ou invalide.');
        }
      } else {
        showAlert('Erreur', 'Le format de l\'URL est incorrect.');
      }
      setIsProcessing(false);
    };

    const subscription = Linking.addListener('url', handleUrl);
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl({ url });
      else setIsProcessing(false);
    });

    return () => {
      subscription.remove();
    };
  }, [isTokenProcessed]);

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .required('Mot de passe requis')
      .matches(/[a-z]/, 'Le mot de passe doit contenir au moins une lettre minuscule')
      .matches(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule')
      .matches(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
      .matches(/[@$!%*?&]/, 'Le mot de passe doit contenir au moins un caractère spécial'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Les mots de passe ne correspondent pas')
      .required('Confirmation du mot de passe requise'),
  });

  const handlePasswordChange = (password) => {
    const criteria = {
      minLength: password.length >= 8,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[@$!%*?&]/.test(password),
    };
    setPasswordCriteria(criteria);
    setIsPasswordValid(Object.values(criteria).every((value) => value === true));
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true); // Afficher un message de déconnexion immédiatement
  
      const result = await logoutUser();  // Effectuer la déconnexion
      if (result.success) {
        logout();  // Met à jour l'état de l'utilisateur dans le contexte
        showAlert(
          'Nouveau mot de passe crée avec succes',
          'Vous avez été déconnecté. Vous devrez vous reconnecter avec vos nouveaux identifiants.',
          () => navigation.navigate('Login')  // Navigation vers l'écran de connexion
        );
      } else {
        showAlert('Erreur', result.message);
      }
      setIsLoggingOut(false);  // Terminer l'état de déconnexion
    } catch (error) {
      showAlert('Erreur', 'Une erreur inattendue est survenue. Veuillez réessayer.');
      setIsLoggingOut(false);  // Gérer l'état de déconnexion en cas d'erreur
    }
  };

  const handleResetPassword = async (values) => {
    if (!token) {
      showAlert('Erreur', 'Le token de réinitialisation est manquant.');
      return;
    }
  
    setLoading(true);
    try {
      const result = await resetPassword(token, values.password);
      if (result.success) {
        showAlert(
          'Réinitialisation réussie',
          'Votre mot de passe a été réinitialisé avec succès.',
          () => {
            if (isAuthenticated) {
              handleLogout();
            } else {
              navigation.navigate('Login');
            }
          }
        );
      } else {
        showAlert('Erreur', 'Le token de réinitialisation est vide ou invalide.', () => {
          navigation.goBack();  // Naviguer en arrière après l'alerte
        });
      }
    } catch (error) {
      showAlert('Erreur', 'Une erreur est survenue lors de la réinitialisation du mot de passe. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Réinitialiser le mot de passe</Text>

      <Formik
        initialValues={{ password: '', confirmPassword: '' }}
        validationSchema={validationSchema}
        onSubmit={handleResetPassword}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <TextInput
              style={[styles.input, touched.password && errors.password ? styles.inputError : null]}
              placeholder="Nouveau mot de passe"
              secureTextEntry
              onChangeText={(text) => {
                handleChange('password')(text);
                handlePasswordChange(text);
              }}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            {!isPasswordValid && values.password.length > 0 && (
              <View style={styles.passwordCriteriaContainer}>
                <View style={[styles.badge, passwordCriteria.minLength ? styles.validBadge : styles.invalidBadge]}>
                  <Text style={styles.badgeText}>8+ caractères</Text>
                </View>
                <View style={[styles.badge, passwordCriteria.hasLowercase ? styles.validBadge : styles.invalidBadge]}>
                  <Text style={styles.badgeText}>Minuscule</Text>
                </View>
                <View style={[styles.badge, passwordCriteria.hasUppercase ? styles.validBadge : styles.invalidBadge]}>
                  <Text style={styles.badgeText}>Majuscule</Text>
                </View>
                <View style={[styles.badge, passwordCriteria.hasNumber ? styles.validBadge : styles.invalidBadge]}>
                  <Text style={styles.badgeText}>Chiffre</Text>
                </View>
                <View style={[styles.badge, passwordCriteria.hasSpecialChar ? styles.validBadge : styles.invalidBadge]}>
                  <Text style={styles.badgeText}>Spécial</Text>
                </View>
              </View>
            )}

            <TextInput
              style={[styles.input, touched.confirmPassword && errors.confirmPassword ? styles.inputError : null]}
              placeholder="Confirmer le mot de passe"
              secureTextEntry
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              value={values.confirmPassword}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                (loading || !isPasswordValid) ? styles.buttonDisabled : null,
              ]}
              onPress={handleSubmit}
              disabled={loading || !isPasswordValid}
            >
              <Text style={[styles.buttonText, (loading || !isPasswordValid) ? styles.buttonTextDisabled : null]}>
                {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>

    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#f44336',
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  passwordCriteriaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical:10
  },
  badge: {
    margin: 3,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  validBadge: {
    backgroundColor: 'green',
  },
  invalidBadge: {
    backgroundColor: 'red',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',  // Couleur de fond du bouton désactivé
  },
  buttonTextDisabled: {
    color: '#666666',  // Couleur du texte pour le bouton désactivé
  },
});

export default ResetPasswordScreen;
