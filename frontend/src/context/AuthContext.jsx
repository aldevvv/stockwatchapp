import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Buat Context
const AuthContext = createContext(null);

// 2. Buat Provider Component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('stockwatch_token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Jika ada token, coba verifikasi atau ambil data user
    // Untuk sekarang, kita anggap token valid jika ada
    if (token) {
      // Logika decode token atau fetch data user bisa ditambahkan di sini
      // Contoh dummy:
      const dummyUser = { email: 'user@stockwatch.com' }; // Nanti ini dari token
      setUser(dummyUser);
    }
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

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Buat custom hook untuk mempermudah penggunaan context
export const useAuth = () => {
  return useContext(AuthContext);
};