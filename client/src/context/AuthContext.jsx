import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if we are using the placeholder firebase config
  const isMock = auth.app.options.apiKey === "AIzaSy_mock_api_key_replace_this";

  // Sign up
  const signup = async (email, password) => {
    if (isMock) {
      return new Promise((resolve) => setTimeout(() => {
        const user = { uid: "mock_uid_" + Date.now(), email, displayName: email.split('@')[0] };
        setCurrentUser(user);
        resolve({ user });
      }, 1000));
    }
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // Login
  const login = async (email, password) => {
    if (isMock) {
      return new Promise((resolve) => setTimeout(() => {
        const user = { uid: "mock_uid_existing", email, displayName: email.split('@')[0] };
        setCurrentUser(user);
        resolve({ user });
      }, 1000));
    }
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Logout
  const logout = async () => {
    if (isMock) {
      return new Promise((resolve) => setTimeout(() => {
        setCurrentUser(null);
        resolve();
      }, 500));
    }
    return signOut(auth);
  }

  useEffect(() => {
    if (isMock) {
      setLoading(false);
      return () => {};
    }

    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [isMock]);

  const value = {
    currentUser,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
