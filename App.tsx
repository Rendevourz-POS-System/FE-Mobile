import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import RootNavigationStack from './components/navigations/Root/AppNavigationStack';
import { AuthProvider } from './app/context/AuthContext';
import AppNavigationStack from './components/navigations/Root/AppNavigationStack';

export default function App() {
  return (
    <AuthProvider>
        <AppNavigationStack />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
