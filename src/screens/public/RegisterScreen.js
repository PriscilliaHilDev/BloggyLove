import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';



const RegisterScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);


  // Variables pour la visibilité des mots de passe
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(false);

  const passwordVisibilityIcon = passwordVisibility ? <Icon name="eye" size={30} color='black' />: <Icon name="eye-slash" size={30} color='black' />;
  const confirmPasswordVisibilityIcon = confirmPasswordVisibility ?<Icon name="eye" size={30} color='black' /> : <Icon name="eye-slash" size={30} color='black' />;

  // Variables pour valider le mot de passe
  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Le nom est requis'),
    email: Yup.string().email('Email invalide').required('Email est requis'),
    password: Yup.string()
      .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
      .required('Mot de passe est requis')
      .matches(/[a-z]/, 'Le mot de passe doit contenir au moins une lettre minuscule')
      .matches(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule')
      .matches(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
      .matches(/[@$!%*?&]/, 'Le mot de passe doit contenir au moins un caractère spécial'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Les mots de passe ne correspondent pas')
      .required('La confirmation du mot de passe est requise'),
  });

  const handlePasswordChange = (password) => {
    const criteria = {
      minLength: password.length >= 6,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[@$!%*?&]/.test(password),
    };
    setPasswordCriteria(criteria);
    setIsPasswordValid(Object.values(criteria).every((value) => value === true));
  };

  const handleRegister = async (values, resetForm) => {
    const { name, email, password } = values;
    setIsLoading(true);

    try {
      const result = await registerUser({ name, email, password });

      if (result.success) {
        resetForm();
        login();
      } else {
        Alert.alert('Erreur', result.message);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur inattendue est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour basculer la visibilité des mots de passe
  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisibility(!confirmPasswordVisibility);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Inscription</Text>
        <Formik
          initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => handleRegister(values, resetForm)}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    touched.name && errors.name ? styles.inputError : null,
                    values.name && !errors.name ? styles.inputValid : null,
                  ]}
                  placeholder="Nom"
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                />
                {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    touched.email && errors.email ? styles.inputError : null,
                    values.email && !errors.email ? styles.inputValid : null,
                  ]}
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
                  secureTextEntry={!passwordVisibility}
                  onChangeText={(text) => {
                    handleChange('password')(text);
                    handlePasswordChange(text); // Validation mot de passe
                  }}
                  onBlur={handleBlur('password')}
                  value={values.password}
                />
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                  <Text>{passwordVisibilityIcon}</Text>
                </TouchableOpacity>
              </View>

              {/* Affichage des critères sous forme de badges */}
              {!isPasswordValid && values.password.length > 0 && (
                <View style={styles.passwordCriteriaContainer}>
                  <View
                    style={[styles.badge, passwordCriteria.minLength ? styles.validBadge : styles.invalidBadge]}
                  >
                    <Text style={styles.badgeText}>6+ caractères</Text>
                  </View>
                  <View
                    style={[styles.badge, passwordCriteria.hasLowercase ? styles.validBadge : styles.invalidBadge]}
                  >
                    <Text style={styles.badgeText}>Minuscule</Text>
                  </View>
                  <View
                    style={[styles.badge, passwordCriteria.hasUppercase ? styles.validBadge : styles.invalidBadge]}
                  >
                    <Text style={styles.badgeText}>Majuscule</Text>
                  </View>
                  <View
                    style={[styles.badge, passwordCriteria.hasNumber ? styles.validBadge : styles.invalidBadge]}
                  >
                    <Text style={styles.badgeText}>Chiffre</Text>
                  </View>
                  <View
                    style={[styles.badge, passwordCriteria.hasSpecialChar ? styles.validBadge : styles.invalidBadge]}
                  >
                    <Text style={styles.badgeText}>Spécial</Text>
                  </View>
                </View>
              )}

              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, touched.confirmPassword && errors.confirmPassword ? styles.inputError : null]}
                  placeholder="Confirmer le mot de passe"
                  secureTextEntry={!confirmPasswordVisibility}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                />
                <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.eyeIcon}>
                  <Text>{confirmPasswordVisibilityIcon}</Text>
                </TouchableOpacity>
                {touched.confirmPassword && errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <Text style={styles.submitButtonText}>Chargement...</Text>
                ) : (
                  <Text style={styles.submitButtonText}>S'inscrire</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </Formik>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Vous avez déjà un compte ? Connectez-vous</Text>
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
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  inputValid: {
    borderColor: 'green',
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
  passwordCriteriaContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
});

export default RegisterScreen;
