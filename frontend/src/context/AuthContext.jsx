import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUserProfile as fetchUserProfileAPI } from '../user/userService'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('stockwatch_token'));
  const [user, setUser] = useState(null); 
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('stockwatch_token');
      if (storedToken) {
        setToken(storedToken); // Make sure token state is set
        try {
          const response = await fetchUserProfileAPI();
          setUser(response.data.data);
        } catch (error) {
          console.error("Gagal memuat data user dari token:", error);
          localStorage.removeItem('stockwatch_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoadingUser(false);
    };
    loadUser();
  }, [token]); 

  const login = (authData) => {
    localStorage.setItem('stockwatch_token', authData.token);
    setToken(authData.token);
    setUser(authData.user); 
  };

  const logout = () => {
    localStorage.removeItem('stockwatch_token');
    setToken(null);
    setUser(null);
  };

  if (isLoadingUser) {
    return <p style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2rem' }}>Memuat aplikasi...</p>;
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoadingUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};