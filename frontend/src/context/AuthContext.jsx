import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';
import { getUserProfile } from '../user/userService';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) { return null; }
  });
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [token]);

  const login = (authData) => {
    setToken(authData.token);
    setUser(authData.user);
    localStorage.setItem('user', JSON.stringify(authData.user));
  };

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const refreshUserData = useCallback(async () => {
    if (!token) {
      setIsLoadingUser(false);
      return;
    }
    try {
      const response = await getUserProfile();
      const updatedProfile = response.data.data;
      setUser(currentAuthUser => {
        const newUserData = { ...currentAuthUser, ...updatedProfile };
        localStorage.setItem('user', JSON.stringify(newUserData));
        return newUserData;
      });
    } catch (error) {
      console.error("Sesi tidak valid, token akan dihapus oleh interceptor.", error);
    } finally {
      setIsLoadingUser(false);
    }
  }, [token]);

  useEffect(() => {
    refreshUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, refreshUserData, isLoadingUser }}>
      {children}
    </AuthContext.Provider>
  );
}