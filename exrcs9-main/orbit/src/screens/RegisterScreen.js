// src/screens/RegisterScreen.js
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
    case 'auth/email-already-in-use':
      return 'This email is already registered to another observer.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/network-request-failed':
      return 'Connection lost. Check your signal.';
    default:
      return 'Could not create account. Please try again.';
  }
};

const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, delay: 100, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, delay: 100, useNativeDriver: true }),
    ]).start();
  }, []);

  const validate = () => {
    const e = {};
    if (!username.trim()) e.username = 'Observer name is required';
    else if (username.trim().length < 3) e.username = 'Must be at least 3 characters';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'At least 6 characters';
    if (!confirm) e.confirm = 'Please confirm your password';
    else if (confirm !== password) e.confirm = 'Passwords do not match';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await register(email.trim(), password, username.trim());
    } catch (err) {
      Alert.alert('Registration Failed', firebaseError(err.code));
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
      <View style={styles.nebulaLeft} />
      <View style={styles.nebulaRight} />

      {/* Back button — pinned to top-left, outside scroll */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back to Login</Text>
      </TouchableOpacity>

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
            <View style={styles.header}>
              <Text style={styles.headerEmoji}>🌠</Text>
              <Text style={styles.headerTitle}>Join the Observatory</Text>
              <Text style={styles.headerSub}>
                Create your observer profile and start logging celestial events
              </Text>
            </View>

            <View style={styles.card}>
              <CosmosInput
                label="Observer Name"
                value={username}
                onChangeText={setUsername}
                placeholder="e.g. StargazerJan"
                autoCapitalize="words"
                error={errors.username}
              />
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
                placeholder="Min. 6 characters"
                secureTextEntry
                error={errors.password}
              />
              <CosmosInput
                label="Confirm Password"
                value={confirm}
                onChangeText={setConfirm}
                placeholder="Repeat your password"
                secureTextEntry
                error={errors.confirm}
              />

              <View style={styles.spacer} />

              <TouchableOpacity
                style={[styles.registerBtn, loading && styles.btnDisabled]}
                onPress={handleRegister}
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
                    : <Text style={styles.btnText}>BEGIN MY JOURNEY</Text>
                  }
                </LinearGradient>
              </TouchableOpacity>

              <Text style={styles.termsText}>
                By joining, you agree to observe responsibly and share the skies. ✨
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  nebulaLeft: {
    position: 'absolute', top: 60, left: -60,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(30,58,138,0.1)',
  },
  nebulaRight: {
    position: 'absolute', bottom: 80, right: -40,
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(59,15,140,0.1)',
  },

  // Pinned absolutely to top-left, always visible
  backBtn: {
    position: 'absolute',
    top: 56,
    left: 24,
    zIndex: 10,
  },
  backText: { color: 'rgba(200,200,255,0.55)', fontSize: 13, fontWeight: '600', letterSpacing: 0.3 },

  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,   // clears the absolute back button
    paddingBottom: 50,
  },
  content: { alignItems: 'center', width: '100%', maxWidth: 420 },

  header: { alignItems: 'center', marginBottom: 22 },
  headerEmoji: { fontSize: 36, marginBottom: 8 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5, textAlign: 'center' },
  headerSub: {
    fontSize: 12, color: 'rgba(200,200,220,0.45)',
    textAlign: 'center', marginTop: 6, lineHeight: 18, paddingHorizontal: 16,
  },

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

  spacer: { height: 16 },

  registerBtn: { borderRadius: 12, overflow: 'hidden', marginTop: 4 },
  btnDisabled: { opacity: 0.5 },
  btnGradient: { paddingVertical: 17, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800', letterSpacing: 1.5 },

  termsText: {
    fontSize: 10, color: 'rgba(200,200,220,0.25)',
    textAlign: 'center', marginTop: 18, lineHeight: 16,
  },
});

export default RegisterScreen;