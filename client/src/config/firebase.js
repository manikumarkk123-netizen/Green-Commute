import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase project config from Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSy_mock_api_key_replace_this",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "green-commute.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "green-commute",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "green-commute.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:mockid",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
