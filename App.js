import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import AppNavigation from './src/navigation/AppNavigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function AppContent() {
  const { isLoading } = React.useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <AppNavigation />;
}

export default function App() {
  return (
    <SafeAreaProvider>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
