import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { token } = useAuth();

  if (!token) {
    // Jika tidak ada token, arahkan ke halaman login
    return <Navigate to="/login" replace />;
  }

  // Jika ada token, tampilkan halaman yang diminta
  return children;
}

export default ProtectedRoute;