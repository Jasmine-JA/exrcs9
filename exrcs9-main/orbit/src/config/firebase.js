// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCX74TnlSWvdlZN1SUdIbgnb_4liycF-EQ",
  authDomain: "orbit-app-3af89.firebaseapp.com",
  projectId: "orbit-app-3af89",
  storageBucket: "orbit-app-3af89.firebasestorage.app",
  messagingSenderId: "879796202079",
  appId: "1:879796202079:web:0f8900d8b69ea8fccd49ea",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;