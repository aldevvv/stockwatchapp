import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminLayout from './admin/components/layout/AdminLayout';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PricingPage from './pages/PricingPage';
import TestimonialsPage from './pages/TestimonialsPage';
import PricingInfoPage from './pages/PricingInfoPage';

import LoginPage from './auth/LoginPage';
import RegisterPage from './auth/RegisterPage';
import VerifyEmailPage from './auth/VerifyEmailPage';
import RequestPasswordResetPage from './auth/RequestPasswordResetPage';
import ResetPasswordPage from './auth/ResetPasswordPage';

import DashboardPage from './dashboard/DashboardPage';
import PengaturanPage from './user/PengaturanPage';
import RiwayatStokPage from './laporan/RiwayatStokPage';
import SupplierPage from './supplier/SupplierPage';
import StockSharePage from './stockshare/StockSharePage'; 


import AdminDashboardPage from './admin/pages/AdminDashboardPage';
import AdminUsersPage from './admin/pages/AdminUsersPage';
import AdminUserStockPage from './admin/pages/AdminUserStockPage';
import AdminSendMessagePage from './admin/pages/AdminSendMessagePage';

import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './admin/components/AdminProtectedRoute';

function App() {
  const { token, user, isLoadingUser } = useAuth();

  if (isLoadingUser && token) {
      return <p style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2rem' }}>Memuat sesi pengguna...</p>;
  }

  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/pricing-info" element={<PricingInfoPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          
          <Route path="/login" element={token && user?.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> : (token && user?.role !== 'admin' ? <Navigate to="/dashboard" replace /> : <LoginPage />)} />
          <Route path="/register" element={token ? (user?.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/dashboard" replace />) : <RegisterPage />} />
          <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
          <Route path="/request-password-reset" element={token ? (user?.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/dashboard" replace />) : <RequestPasswordResetPage />} />
          <Route path="/reset-password/:token" element={token ? (user?.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/dashboard" replace />) : <ResetPasswordPage />} />
        </Route>
            
        <Route 
          element={
            <ProtectedRoute>
              <DashboardLayout /> 
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pengaturan" element={<PengaturanPage />} />
          <Route path="/riwayatstok" element={<RiwayatStokPage />} />
          <Route path="/suppliers" element={<SupplierPage />} />
          <Route path="/stockshare" element={<StockSharePage />} />

        </Route>

        <Route
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/users/:targetUserId/stok" element={<AdminUserStockPage />} />
          <Route path="/admin/messages/send" element={<AdminSendMessagePage />} />
        </Route>

        <Route path="*" element={<Navigate to={token ? (user?.role === 'admin' ? "/admin/dashboard" : "/dashboard") : "/"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;