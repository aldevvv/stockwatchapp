import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginService } from './authService';
import { showErrorToast } from '../utils/toastHelper';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login: loginContextAction } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const authData = await loginService(email, password);
      loginContextAction(authData); 

      if (authData.user && authData.user.role === 'admin') {
        navigate('/admin/dashboard'); 
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      showErrorToast(err.response?.data?.message || 'Login gagal. Periksa kembali kredensial Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-branding-side">
        <div className="branding-content">
          <h1 className="branding-title">Manajemen Stok Cerdas untuk Bisnis Anda</h1>
          <p className="branding-subtitle">Fokus pada pertumbuhan, biarkan kami yang mengurus detail inventaris Anda.</p>
        </div>
      </div>
      <div className="auth-form-side">
        <div className="auth-form-wrapper">
          <Link to="/">
            <img src="/Logo.png" alt="StockWatch Logo" className="auth-form-logo" />
          </Link>
          <div className="form-header">
            <h2>Selamat Datang Kembali!</h2>
            <p>Silakan masuk untuk melanjutkan ke dashboard Anda.</p>
          </div>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-options">
                <Link to="/request-password-reset" className="forgot-password-link">Lupa Password?</Link>
            </div>
            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Login'}
            </button>
          </form>
          <p className="auth-switch-link">
            Belum punya akun? <Link to="/register">Daftar di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;