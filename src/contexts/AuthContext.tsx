import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiLogin, apiSignup } from '@/lib/api';

interface User {
  id: string;
  username: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    const userData = localStorage.getItem('user-data');
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user-data');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await apiLogin(username, password);
      const token: string = res.access_token;
      localStorage.setItem('auth-token', token);
      const newUser: User = { id: 'me', username, name: username.charAt(0).toUpperCase() + username.slice(1) };
      localStorage.setItem('user-data', JSON.stringify(newUser));
      setUser(newUser);
      return true;
    } catch (e) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await apiSignup(username, password);
      const token: string = res.access_token;
      localStorage.setItem('auth-token', token);
      const newUser: User = { id: 'me', username, name: username.charAt(0).toUpperCase() + username.slice(1) };
      localStorage.setItem('user-data', JSON.stringify(newUser));
      setUser(newUser);
      return true;
    } catch (e) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-data');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};