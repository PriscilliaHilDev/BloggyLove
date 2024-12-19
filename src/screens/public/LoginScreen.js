import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../../context/AuthContext'; // Importer le contexte AuthContext
import { loginUser } from '../../services/authService';
import Icon from 'react-native-vector-icons/FontAwesome';

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext); // Utiliser login du AuthContext
  const [secureText, setSecureText] = useState(true); // État pour contrôler la visibilité du mot de passe
  const passwordVisibilityIcon = !secureText ? <Icon name="eye" size={30} color="black" /> : <Icon name="eye-slash" size={30} color="black" />;

  // Validation de formulaire avec Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email invalide').required('Email est requis'),
    password: Yup.string().required('Mot de passe est requis'),
  });

  const handleLogin = async (values, resetForm) => {
    try {
      // Appeler le service pour effectuer la connexion (remplacer par votre logique de connexion)
      const result = await loginUser(values);

      if (result.success) {
        // Réinitialisation des champs du formulaire si la connexion est réussie
        resetForm();
        login();
      } else {
        Alert.alert('Erreur', result.message);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur inattendue est survenue. Veuillez réessayer.');
    }
  };

  // const myIcon = <Icon name="rocket" size={30} color="#900" />;


  // Fonction pour basculer l'état du mot de passe (afficher/masquer)
  const toggleSecureTextEntry = () => {
    setSecureText(!secureText);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Connexion</Text>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            handleLogin(values, resetForm); // Appel de handleLogin et passage de resetForm
          }}
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

              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, touched.password && errors.password ? styles.inputError : null]}
                  placeholder="Mot de passe"
                  secureTextEntry={secureText}  // Masquer ou afficher le mot de passe
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                />
                {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                <TouchableOpacity onPress={toggleSecureTextEntry} style={styles.eyeIcon}>
                  <Text>{passwordVisibilityIcon}</Text> {/* Affiche une icône pour basculer l'affichage du mot de passe */}
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.linkForgotPassword}>Mot de passe oublié ?</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Se connecter</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Vous n'avez pas encore de compte ?</Text>
          <Text style={styles.linkText}> Inscrivez-vous</Text>
        </TouchableOpacity>
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
    position: 'relative',  // Nécessaire pour positionner l'icône de l'œil
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
  linkText: {
    color: '#007BFF',
    textAlign: 'center',
    fontSize: 14,
  },
  linkForgotPassword: {
    color: '#007BFF',
    fontSize: 14,
    padding: 10,
    textAlign: 'right', // Aligner le texte à droite
    width: '100%', // Nécessaire pour que l'alignement fonctionne correctement
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 12,  // Positionne l'icône à droite du champ de saisie
  },
});

export default LoginScreen;
