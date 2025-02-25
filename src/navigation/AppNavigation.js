import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';

// Importation des écrans
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
import CreationsScreen from '../screens/private/CreationsScreen';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// ✅ HEADER PERSONNALISÉ (Bouton Hamburger pour ouvrir le Drawer)
const CustomHeader = () => {
  const navigation = useNavigation(); // Utilisation de useNavigation

  return (
    <View style={{ flexDirection: 'row-reverse', justifyContent:'space-between', alignItems: 'center', padding: 15, backgroundColor: '#6200ea' }}>
      <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginRight: 15 }}>
        <Icon name="bars" size={24} color="white" />
      </TouchableOpacity>
      <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}>Bloggy Love</Text>
    </View>
  );
};

// ✅ NAVIGATION BOTTOM TABS (Barre d'onglets en bas)
const BottomTabNavigator = ({ navigation }) => {
  return (
    <Tab.Navigator
      initialRouteName="Flux"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Flux') iconName = 'home';
          else if (route.name === 'Inspiration') iconName = 'lightbulb-o';
          else if (route.name === 'Favorites') iconName = 'heart';
          else if (route.name === 'Créations') iconName = 'pencil';
          return <Icon name={iconName} size={size} color={color} />;
        },
        header: () => <CustomHeader navigation={navigation} />, // 🔥 Ajout du bouton menu dans le Header
        headerShown: true,
      })}
    >
      <Tab.Screen name="Flux" component={FluxScreen} />
      <Tab.Screen name="Inspiration" component={InspirationScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Créations" component={CreationsScreen} />
    </Tab.Navigator>
  );
};

// ✅ NAVIGATION DRAWER (Menu latéral)
const DrawerNavigator = ({ navigation }) => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: { width: 250 },
        overlayColor: 'rgba(0,0,0,0.5)',
      }}
    >
      {/* Écran principal avec BottomTabNavigator et CustomHeader */}
      <Drawer.Screen
        name="Accueil"
        component={BottomTabNavigator}
        options={{
          headerShown: false, // S'assurer que le header est bien affiché
          // Utilisation de `jumpTo` pour accéder directement à l'écran "Flux" du Tab Navigator
          drawerLabel: 'Accueil',
          gestureHandler: () => {
            // Accéder directement à l'écran "Flux" dans le BottomTabNavigator
            navigation.jumpTo('Flux');
          },
        }}
      />
      {/* Écran 'Mes créations' */}
      <Drawer.Screen
        name="Mon Profil"
        component={ProfileScreen} // Remplacer par ton composant approprié
        options={{
          header: () => <CustomHeader navigation={navigation} />, // Ajouter le header
          headerShown: true,
        }}
      />
      {/* Écran 'Mes favoris' */}
      <Drawer.Screen
        name="Messagerie"
        component={MessagingScreen} // Remplacer par ton composant approprié
        options={{
          header: () => <CustomHeader navigation={navigation} />, // Ajouter le header
          headerShown: true,
        }}
      />
    </Drawer.Navigator>
  );
};



// ✅ NAVIGATION PRINCIPALE
const AppNavigation = () => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

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
        <DrawerNavigator />
      ) : (
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigation;
