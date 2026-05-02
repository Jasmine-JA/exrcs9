// src/components/SplashScreen.js
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const SplashScreen = () => (
  <View style={styles.root}>
    <LinearGradient
      colors={['#000000', '#05091A', '#0A0D2E']}
      style={StyleSheet.absoluteFill}
    />
    <Text style={styles.logo}>🔭</Text>
    <Text style={styles.title}>ORBIT</Text>
    <ActivityIndicator color="rgba(200,200,255,0.5)" style={{ marginTop: 32 }} />
    <Text style={styles.sub}>Loading the cosmos...</Text>
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  logo: { fontSize: 48, marginBottom: 12 },
  title: { fontSize: 36, fontWeight: '900', color: '#FFFFFF', letterSpacing: 12 },
  sub: { marginTop: 12, fontSize: 12, color: 'rgba(200,200,220,0.4)', letterSpacing: 1 },
});

export default SplashScreen;