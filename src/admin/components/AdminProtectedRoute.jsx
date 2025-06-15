import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function AdminProtectedRoute({ children }) {
  const { token, user, isLoadingUser } = useAuth();

  if (isLoadingUser) {
    return <p style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2rem' }}>Memeriksa autentikasi admin...</p>; 
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user && user.role !== 'admin') {
    console.warn("Akses admin ditolak: Pengguna bukan admin. Role saat ini:", user.role);
    return <Navigate to="/dashboard" replace />; 
  }
  
  if (user && user.role === 'admin') {
    return children ? children : <Outlet />;
  }

  // Fallback jika user null tapi token ada (misal, saat data user belum ter-load sempurna)
  // atau jika ada kondisi aneh lainnya. Ini akan mencegah render halaman admin jika user.role belum 'admin'.
  console.warn("AdminProtectedRoute: Kondisi user tidak terpenuhi untuk akses admin. User:", user);
  return <Navigate to="/login" replace />; 
}

export default AdminProtectedRoute;