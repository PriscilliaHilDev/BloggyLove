import React, { useContext } from 'react';
import { View, Text } from 'react-native'; // Assurez-vous d'importer View et Text
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { createStackNavigator } from '@react-navigation/stack';


// Importer les écrans
import HomeScreen from '../screens/public/HomeScreen';
import LoginScreen from '../screens/public/LoginScreen';
import RegisterScreen from '../screens/public/RegisterScreen';
import ForgotPasswordScreen from '../screens/public/ForgetPasswordScreen';
import ResetPasswordScreen from '../screens/public/ResetPasswordScreen';
import FluxScreen from '../screens/private/FluxScreen';
import ProfileScreen from '../screens/private/ProfileScreen';
import MessagingScreen from '../screens/private/MessagingScreen';
import InspirationScreen from '../screens/private/InspirationScreen';
import FavoritesScreen from '../screens/private/FavoritesScreen';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importer FontAwesome pour les icônes

const Tab = createBottomTabNavigator(); // Créer le TabNavigator
const Stack = createStackNavigator(); // Créer le StackNavigator

const AppNavigation = () => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  console.log('isAuthenticated dans AppNavigation :', isAuthenticated);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Tab.Navigator 
          initialRouteName="Flux"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === 'Flux') {
                iconName = 'home';
              } else if (route.name === 'Inspiration') {
                iconName = 'lightbulb-o';  // Exemple d'icône pour Inspiration
              } else if (route.name === 'Profile') {
                iconName = 'user';  // Exemple d'icône pour Profile
              } else if (route.name === 'Messages') {
                iconName = 'comment';  // Exemple d'icône pour Messages
              } else if (route.name === 'Favorites') {
                iconName = 'heart';  // Exemple d'icône pour Favorites
              }
              return <Icon name={iconName} size={size} color={color} />;
            },
            headerShown: false
          })}
        >
          <Tab.Screen name="Flux" component={FluxScreen} />
          <Tab.Screen name="Inspiration" component={InspirationScreen} />
          <Tab.Screen name="Favorites" component={FavoritesScreen} />
          <Tab.Screen name="Messages" component={MessagingScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />

        </Tab.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigation;
