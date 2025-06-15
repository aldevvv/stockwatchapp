import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset as requestPasswordResetService } from './authService';
import { showInfoToast, showErrorToast } from '../utils/toastHelper';
import './RequestPasswordResetPage.css';

function RequestPasswordResetPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await requestPasswordResetService(email);
      showInfoToast(response.message);
    } catch (err) {
      showErrorToast(err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-branding-side">
        <div className="branding-content">
          <h1 className="branding-title">Lupa Password Anda?</h1>
          <p className="branding-subtitle">Jangan khawatir. Cukup masukkan email Anda dan kami akan mengirimkan tautan untuk mengatur ulang password Anda.</p>
        </div>
      </div>
      <div className="auth-form-side">
        <div className="auth-form-wrapper">
          <Link to="/">
            <img src="/Logo.png" alt="StockWatch Logo" className="auth-form-logo" />
          </Link>
          <div className="form-header">
            <h2>Reset Password</h2>
            <p>Masukkan email yang terhubung dengan akun Anda.</p>
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
            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? 'Mengirim...' : 'Kirim Link Reset'}
            </button>
          </form>
          <p className="auth-switch-link">
            Ingat password Anda? <Link to="/login">Kembali ke Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RequestPasswordResetPage;