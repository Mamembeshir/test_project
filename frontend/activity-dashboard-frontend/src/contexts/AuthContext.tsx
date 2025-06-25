import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authAPI, profileAPI, setTokens, clearTokens, getToken, getRefreshToken } from '../api';
import type { User, LoginRequest, RegisterRequest } from '../api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await profileAPI.get();
      setUser(response.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (getToken()) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (data: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(data);
      const { access, refresh } = response.data;
      setTokens(access, refresh);
      await fetchProfile();
    } catch (err) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || 'Login failed');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setLoading(true);
    setError(null);
    try {
      await authAPI.register(data);
      await login({ username: data.username, password: data.password });
    } catch (err) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || 'Registration failed');
      setUser(null);
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      const refresh = getRefreshToken();
      if (refresh) {
        console.log("Logging out with refresh token", refresh);
        await authAPI.logout(refresh);
      } else {
        await authAPI.logout();
      }
    } catch {
      // Ignore logout errors
    }
    clearTokens();
    setUser(null);
    setLoading(false);
  };

  const refreshProfile = fetchProfile;
  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      register, 
      logout, 
      refreshProfile, 
      clearError 
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 