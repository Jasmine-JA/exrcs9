// src/screens/LoginScreen.js
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CosmosInput from '../components/CosmosInput';
import StarField from '../components/StarField';
import { useAuth } from '../hooks/useAuth';

const firebaseError = (code) => {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'No observer found with those credentials.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment.';
    case 'auth/network-request-failed':
      return 'Connection lost. Check your signal.';
    default:
      return 'Something went wrong. Please try again.';
  }
};

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 900, delay: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, delay: 200, useNativeDriver: true }),
    ]).start();
  }, []);

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      Alert.alert('Access Denied', firebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#000000', '#05091A', '#0A0D2E']}
        style={StyleSheet.absoluteFill}
      />
      <StarField />
      <View style={styles.nebulaBlue} />
      <View style={styles.nebulaPurple} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
          >
            <View style={styles.logoWrap}>
              <View style={styles.orbitRing}>
                <View style={styles.planetCore}>
                  <Text style={styles.planetEmoji}>🔭</Text>
                </View>
              </View>
              <Text style={styles.appName}>ORBIT</Text>
              <Text style={styles.appTagline}>Track the cosmos. Share the wonder.</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Welcome back, Observer</Text>
              <Text style={styles.cardSubtitle}>Sign in to your stargazing journal</Text>

              <CosmosInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="observer@cosmos.io"
                keyboardType="email-address"
                error={errors.email}
              />
              <CosmosInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Your secret passphrase"
                secureTextEntry
                error={errors.password}
              />

              {/* Spacer to push buttons down */}
              <View style={styles.spacer} />

              <TouchableOpacity
                style={[styles.launchBtn, loading && styles.btnDisabled]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#1E3A8A', '#3B0F8C']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.btnGradient}
                >
                  {loading
                    ? <ActivityIndicator color="#FFF" />
                    : <Text style={styles.btnText}>LAUNCH INTO ORBIT</Text>
                  }
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>NEW TO ORBIT?</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={styles.registerBtn}
                onPress={() => navigation.navigate('Register')}
                activeOpacity={0.8}
              >
                <Text style={styles.registerBtnText}>Create Observer Account</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.footerText}>
              🌌 Mapping the universe, one sighting at a time
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  nebulaBlue: {
    position: 'absolute', top: -80, right: -80,
    width: 280, height: 280, borderRadius: 140,
    backgroundColor: 'rgba(30,58,138,0.12)',
  },
  nebulaPurple: {
    position: 'absolute', bottom: 100, left: -60,
    width: 220, height: 220, borderRadius: 110,
    backgroundColor: 'rgba(59,15,140,0.1)',
  },

  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  content: { alignItems: 'center', width: '100%', maxWidth: 420 },

  logoWrap: { alignItems: 'center', marginBottom: 26 },
  orbitRing: {
    width: 72, height: 72, borderRadius: 36,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
    shadowColor: '#3B0F8C', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, shadowRadius: 16,
  },
  planetCore: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: 'rgba(30,58,138,0.3)',
    justifyContent: 'center', alignItems: 'center',
  },
  planetEmoji: { fontSize: 22 },
  appName: { fontSize: 32, fontWeight: '900', color: '#FFFFFF', letterSpacing: 12 },
  appTagline: { fontSize: 11, color: 'rgba(200,200,220,0.45)', letterSpacing: 0.8, marginTop: 3 },

  card: {
    width: '100%',
    backgroundColor: 'rgba(8,10,28,0.88)',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 10,
  },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  cardSubtitle: { fontSize: 12, color: 'rgba(200,200,220,0.5)', marginBottom: 28 },

  spacer: { height: 16 },

  launchBtn: { borderRadius: 12, overflow: 'hidden', marginTop: 4 },
  btnDisabled: { opacity: 0.5 },
  btnGradient: { paddingVertical: 17, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800', letterSpacing: 1.5 },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 26 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.07)' },
  dividerText: {
    fontSize: 9, color: 'rgba(200,200,220,0.3)',
    marginHorizontal: 10, letterSpacing: 1.5, fontWeight: '600',
  },

  registerBtn: {
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12, paddingVertical: 17, alignItems: 'center',
  },
  registerBtnText: { color: 'rgba(200,200,255,0.75)', fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },

  footerText: { marginTop: 22, fontSize: 11, color: 'rgba(200,200,220,0.22)', letterSpacing: 0.5 },
});

export default LoginScreen;