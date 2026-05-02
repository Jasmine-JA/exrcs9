// src/navigation/RootNavigator.js
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuth } from '../hooks/useAuth';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SkyMapScreen from '../screens/SkyMapScreen';

const Stack = createNativeStackNavigator();

/**
 * AUTH GUARD PATTERN
 * ─────────────────────────────────────────────────────
 * • loading      → show splash spinner
 * • user exists  → ONLY authenticated screens exist in stack
 * • no user      → ONLY public screens exist in stack
 *
 * Because the wrong screens don't exist at all, React Navigation
 * auto-redirects without any manual navigation calls.
 * Logged-in users CANNOT reach Login/Register.
 * Logged-out users CANNOT reach SkyMap or any protected screen.
 */
const RootNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#7DD3FC" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {user ? (
          /* ── Authenticated ── */
          <Stack.Screen name="SkyMap" component={SkyMapScreen} />
        ) : (
          /* ── Public ── */
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: '#050A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RootNavigator;