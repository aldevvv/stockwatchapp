import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { verifyEmailToken } from './authService';
import { showSuccessToast, showErrorToast, showInfoToast } from '../utils/toastHelper';
import './VerifyEmailPage.css';

function VerifyEmailPage() {
  const { token } = useParams();
  const [message, setMessage] = useState('Sedang memverifikasi email Anda...');
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      showInfoToast('Memproses verifikasi email...');
      const verifyToken = async () => {
        try {
          const response = await verifyEmailToken(token);
          setMessage(response.data.message);
          setStatus('success');
          showSuccessToast(response.data.message + ' Anda akan diarahkan ke halaman login.');
          
          setTimeout(() => {
            navigate('/login');
          }, 5000);

        } catch (err) {
          const errorMsg = err.response?.data?.message || 'Verifikasi gagal. Token mungkin tidak valid atau sudah kedaluwarsa.';
          setMessage(errorMsg);
          setStatus('error');
          showErrorToast(errorMsg);
        }
      };
      verifyToken();
    } else {
      const errorMsg = 'Token verifikasi tidak ditemukan.';
      setMessage(errorMsg);
      setStatus('error');
      showErrorToast(errorMsg);
    }
  }, [token, navigate]);

  return (
    <div className="auth-page-container">
      <div className="auth-branding-side">
        <div className="branding-content">
          <h1 className="branding-title">Satu Langkah Terakhir</h1>
          <p className="branding-subtitle">Terima kasih telah bergabung. Kami sedang memverifikasi akun Anda untuk memastikan keamanan.</p>
        </div>
      </div>
      <div className="auth-form-side">
        <div className="auth-form-wrapper">
          <Link to="/">
            <img src="/Logo.png" alt="StockWatch Logo" className="auth-form-logo" />
          </Link>
          <div className="verify-email-box">
            <h1>Status Verifikasi Email</h1>
            <p className={`status-message status-${status}`}>
                {message}
            </p>
            
            {status !== 'loading' && (
              <Link to="/login" className="auth-button">Ke Halaman Login</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailPage;