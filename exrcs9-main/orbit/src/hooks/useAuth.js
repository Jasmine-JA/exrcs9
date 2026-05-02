// src/hooks/useAuth.js
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const snap = await getDoc(doc(db, 'observers', firebaseUser.uid));
        if (snap.exists()) setUserProfile(snap.data());
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  };

  const register = async (email, password, username) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = cred.user;

    await updateProfile(firebaseUser, { displayName: username });

    await setDoc(doc(db, 'observers', firebaseUser.uid), {
      uid: firebaseUser.uid,
      email,
      username,
      bio: '',
      observationsCount: 0,
      joinedAt: serverTimestamp(),
      favoriteObject: '',
    });

    return firebaseUser;
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};