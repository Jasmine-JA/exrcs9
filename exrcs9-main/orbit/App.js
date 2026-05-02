// App.js
import { registerRootComponent } from 'expo';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/hooks/useAuth';
import RootNavigator from './src/navigation/RootNavigator';

function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

registerRootComponent(App);