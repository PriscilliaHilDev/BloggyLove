import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { forgotPassword } from '../../services/authService'; // Importer la fonction forgotPassword

const ForgotPasswordScreen = ({ navigation }) => {
    // Déclaration d'un état local pour gérer le chargement (spinner ou désactivation des boutons)
const [loading, setLoading] = React.useState(false);

// Définition du schéma de validation avec Yup
// Cela permet de valider que l'email est bien formaté et qu'il est requis
const validationSchema = Yup.object().shape({
  email: Yup.string().email('Email invalide').required('Email est requis'), // Validation de l'email
});

// Fonction qui gère la logique de réinitialisation du mot de passe
// Elle est appelée lors de la soumission du formulaire
const handleForgotPassword = async (values) => {
  setLoading(true); // Active l'état de chargement avant l'envoi de la demande

  try {
    // Appel à la fonction forgotPassword pour envoyer la demande avec l'email
    // Seul l'email est passé, et non un objet supplémentaire
    const result = await forgotPassword(values.email);

    // Désactive l'état de chargement une fois la réponse reçue
    setLoading(false);

    // Si la réponse est positive (succès), affiche un message de confirmation
    if (result.success) {
      Alert.alert(
        'Réinitialisation envoyée', // Titre de l'alerte
        'Un e-mail de réinitialisation a été envoyé à votre adresse.', // Message d'alerte
        [
          {
            text: 'OK', // Bouton OK
            onPress: () => navigation.navigate('Login'), // Naviguer vers l'écran de connexion
          },
        ]
      );
    } else {
      // Si une erreur survient, affiche l'erreur retournée par l'API
      Alert.alert('Erreur', result.message);
    }
  } catch (error) {
    // En cas d'erreur lors de l'appel à l'API (par exemple réseau, serveur, etc.)
    setLoading(false); // Désactive l'état de chargement
    Alert.alert('Erreur', 'Une erreur inattendue est survenue. Veuillez réessayer.'); // Affiche un message générique d'erreur
  }
};

  
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Mot de passe oublié</Text>
  
          <Formik
            initialValues={{ email: '' }}
            validationSchema={validationSchema}
            onSubmit={(values) => handleForgotPassword(values)}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, touched.email && errors.email ? styles.inputError : null]}
                    placeholder="Email"
                    keyboardType="email-address"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                  />
                  {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                </View>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
                  <Text style={styles.submitButtonText}>
                    {loading ? 'Envoi en cours...' : 'Réinitialiser mot de passe'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </View>
      </KeyboardAvoidingView>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'pink',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#f44336',
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default ForgotPasswordScreen;