import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import PublicLayout from './components/layout/PublicLayout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PricingPage from './pages/PricingPage';
import PricingInfoPage from './pages/PricingInfoPage';
import TestimonialsPage from './pages/TestimonialsPage';

import LoginPage from './auth/LoginPage';
import RegisterPage from './auth/RegisterPage';
import VerifyEmailPage from './auth/VerifyEmailPage';
import RequestPasswordResetPage from './auth/RequestPasswordResetPage';
import ResetPasswordPage from './auth/ResetPasswordPage';

import DashboardPage from './dashboard/DashboardPage';
import ProfilePage from './user/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { token } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/pricing-info" element={<PricingInfoPage />} />
        </Route>

        <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        <Route path="/request-password-reset" element={token ? <Navigate to="/dashboard" replace /> : <RequestPasswordResetPage />} />
        <Route path="/reset-password/:token" element={token ? <Navigate to="/dashboard" replace /> : <ResetPasswordPage />} />
        
        <Route 
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profil"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to={token ? "/dashboard" : "/"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;