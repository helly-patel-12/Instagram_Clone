import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User } from '../types';
import { auth, db } from '../utils/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, name: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateCurrentUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// useAuth moved to useAuth.tsx

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    currentUser: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setAuthState({
            isAuthenticated: true,
            currentUser: {
              id: user.uid,
              username: data.username || (user.email ? user.email.split('@')[0] : ''),
              email: user.email || '',
              name: data.name || '',
              password: '',
              bio: data.bio || '',
              avatar: data.avatar || '',
              followers: data.followers || [],
              following: data.following || [],
              posts: data.posts || [],
              savedPosts: data.savedPosts || [],
            },
          });
        } else {
          setAuthState({
            isAuthenticated: true,
            currentUser: null,
          });
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          currentUser: null,
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setAuthState({
          isAuthenticated: true,
          currentUser: {
            id: user.uid,
            username: data.username || (user.email ? user.email.split('@')[0] : ''),
            email: user.email || '',
            name: data.name || '',
            password: '',
            bio: data.bio || '',
            avatar: data.avatar || '',
            followers: data.followers || [],
            following: data.following || [],
            posts: data.posts || [],
            savedPosts: data.savedPosts || [],
          },
        });
      } else {
        setAuthState({
          isAuthenticated: true,
          currentUser: null,
        });
      }
      return true;
    } catch {
      return false;
    }
  };

  const register = async (email: string, name: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Save user profile to Firestore
      const userProfile: User = {
        id: user.uid,
        username: email.split('@')[0],
        email,
        name,
        password: '',
        bio: '',
        avatar: `https://i.pravatar.cc/150?u=${user.uid}`,
        followers: [],
        following: [],
        posts: [],
        savedPosts: [],
      };
      await setDoc(doc(db, 'users', user.uid), userProfile);
      setAuthState({
        isAuthenticated: true,
        currentUser: userProfile,
      });
      return true;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setAuthState({
      isAuthenticated: false,
      currentUser: null,
    });
  };

  const updateCurrentUser = async (user: User) => {
    if (!user.id) return;
    await setDoc(doc(db, 'users', user.id), user);
    // Fetch latest user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.id));
    if (userDoc.exists()) {
      const data = userDoc.data();
      setAuthState({
        isAuthenticated: true,
        currentUser: {
          id: user.id,
          username: data.username,
          email: data.email,
          name: data.name,
          password: '',
          bio: data.bio,
          avatar: data.avatar,
          followers: data.followers || [],
          following: data.following || [],
          posts: data.posts || [],
          savedPosts: data.savedPosts || [],
        },
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      register,
      logout,
      updateCurrentUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};