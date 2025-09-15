// src/screens/public/LoginScreen.js
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../../context/AuthContext'; 
import Icon from 'react-native-vector-icons/FontAwesome';

const LoginScreen = ({ navigation }) => {
  const { login, authError, isLoading } = useContext(AuthContext);
  const [secureText, setSecureText] = useState(true);
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email invalide').required('Email est requis'),
    password: Yup.string().required('Mot de passe est requis'),
  });

  const handleLogin = async (values) => {
    const { email, password } = values;
    const res = await login(email, password);
    if (!res.ok && !res.silent) {
      Alert.alert('Connexion', res.error || authError || 'Impossible de se connecter');
    }
  };

  const toggleSecureTextEntry = () => setSecureText(v => !v);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Connexion</Text>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}                    // ✅ simple
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, touched.email && errors.email ? styles.inputError : null]}
                  placeholder="Email"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                />
                {touched.email && errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, touched.password && errors.password ? styles.inputError : null, { color: '#000' }]}
                  placeholder="Mot de passe"
                  placeholderTextColor="#999"
                  secureTextEntry={secureText}
                  autoCapitalize="none"
                  autoCorrect={false}
                  selectionColor="#000"
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                />
                {touched.password && errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

                <TouchableOpacity onPress={toggleSecureTextEntry} style={styles.eyeIcon} accessibilityRole="button" accessibilityLabel="Afficher/masquer le mot de passe">
                  <Icon name={secureText ? 'eye-slash' : 'eye'} size={24} color="#000" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.linkForgotPassword}>Mot de passe oublié ?</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
                <Text style={styles.submitButtonText}>{isLoading ? 'Chargement…' : 'Se connecter'}</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>

        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ alignItems: 'center' }}>
          <Text style={styles.linkText}>
            Vous n'avez pas encore de compte ? <Text style={styles.linkText}>Inscrivez-vous</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: 'pink' },
  formContainer: { backgroundColor: 'white', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 30 },
  inputContainer: { marginBottom: 15, marginHorizontal: 15, position: 'relative' },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingRight: 40, // espace pour l’icône œil
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
  },
  inputError: { borderColor: '#f44336' },
  errorText: { color: '#f44336', fontSize: 12, marginTop: 5 },
  submitButton: { backgroundColor: '#007BFF', paddingVertical: 12, borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  linkText: { color: '#007BFF', textAlign: 'center', fontSize: 14 },
  linkForgotPassword: { color: '#007BFF', fontSize: 14, padding: 10, textAlign: 'right', width: '100%' },
  eyeIcon: { position: 'absolute', right: 10, top: 12 },
});

export default LoginScreen;
