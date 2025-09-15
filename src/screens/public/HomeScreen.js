import React, { useContext } from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions, Alert } from 'react-native';
import Button from '../../components/Button';
import { AuthContext } from '../../context/AuthContext';
const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { loginWithGoogle, authError, isLoading } = useContext(AuthContext);
  const onGooglePress = async () => {
    const res = await loginWithGoogle();
    if (!res.ok && !res.silent) {
      Alert.alert('Google Login', res.error || authError || 'Erreur Google');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/love-home.jpg')}
      style={styles.background}
      imageStyle={styles.imageStyle}
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <View style={styles.topSection}>
          <Text style={styles.title}>BLOGGY LOVE</Text>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.buttonContainer}>
            <Button title="Se connecter" onPress={() => navigation.navigate('Login')} style={styles.button} />
            <Button title="S'inscrire" onPress={() => navigation.navigate('Register')} style={styles.button} />

            <Text style={styles.orText}>OU</Text>

            <Button
              title={isLoading ? 'Connexion…' : 'Google'}
              onPress={onGooglePress}
              style={styles.button}
              disabled={isLoading} // si ton composant Button supporte cette prop
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: 'center', width: '100%' },
  imageStyle: { resizeMode: 'cover' },
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  container: { flex: 1, justifyContent: 'space-between' },
  topSection: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' },
  bottomSection: {
    flex: 1.8,
    backgroundColor: 'rgba(254, 255, 254, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.1,
    paddingVertical: 20,
    borderTopRightRadius: 160,
    borderTopLeftRadius: 160,
  },
  title: { fontSize: width * 0.12, fontWeight: 'bold', color: 'white' },
  buttonContainer: { width: '100%', justifyContent: 'center', alignItems: 'center' },
  orText: { marginVertical: 10, color: '#000', fontWeight: '600' },
  button: {}, // ton style bouton si besoin
});

export default HomeScreen;
