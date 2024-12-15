import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#120340', // Rose bonbon foncé
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    minHeight: 50,  // Assurez-vous que la hauteur minimale est de 50
    width: '80%',  // Largeur de 80% de l'écran
    flexDirection: 'row',  // Ajoutez cette ligne pour centrer le texte même lorsqu'il est sur plusieurs lignes
    flexWrap: 'wrap',  // Permet au texte de s'enrouler si nécessaire
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center', // Centre le texte horizontalement
    textAlignVertical: 'center',  // Centre le texte verticalement
  },
});

export default Button;
