import React, {useContext} from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions, Alert } from 'react-native';
import Button from '../../components/Button';
import { googleLogin } from '../../services/authService'; // Importer la fonction googleLogin
import { AuthContext } from '../../context/AuthContext';



const { height, width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {

  const { login } = useContext(AuthContext); // Utilisation de la méthode logout depuis AuthContext

  // Fonction pour gérer la connexion Google
  const handleGoogleLogin = async () => {
    const result = await googleLogin();
    if (result.success) {
      login()
    } else if (!result.silent) {
      // Affiche l'erreur uniquement si ce n'est pas une annulation silencieuse
      Alert.alert('Erreur', result.message);
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
            <Text>OU</Text>
            <Button title="Google" onPress={handleGoogleLogin} style={styles.button} />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  imageStyle: {
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
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
  title: {
    fontSize: width * 0.12,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
