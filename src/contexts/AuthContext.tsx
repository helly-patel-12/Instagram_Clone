import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User } from '../types';
import { getCurrentUser, setCurrentUser, getUserByUsername, saveUser, initializeSampleData } from '../utils/storage';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateCurrentUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    currentUser: null,
  });

  useEffect(() => {
    initializeSampleData();
    const user = getCurrentUser();
    if (user) {
      setAuthState({
        isAuthenticated: true,
        currentUser: user,
      });
    }
  }, []);

  const login = async (username: string): Promise<boolean> => {
    const user = getUserByUsername(username);
    if (user) {
      setCurrentUser(user);
      setAuthState({
        isAuthenticated: true,
        currentUser: user,
      });
      return true;
    }
    return false;
  };

  const register = async (username: string, name: string, email: string, password: string): Promise<boolean> => {
    const existingUser = getUserByUsername(username);
    if (existingUser) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      name,
      password,
      bio: '',
      avatar: `https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150`,
      followers: [],
      following: [],
      posts: [],
    };

    saveUser(newUser);
    setCurrentUser(newUser);
    setAuthState({
      isAuthenticated: true,
      currentUser: newUser,
    });
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthState({
      isAuthenticated: false,
      currentUser: null,
    });
  };

  const updateCurrentUser = (user: User) => {
    saveUser(user);
    setCurrentUser(user);
    setAuthState({
      isAuthenticated: true,
      currentUser: user,
    });
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