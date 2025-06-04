import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { verifyEmailToken } from './authService';
import { showSuccessToast, showErrorToast, showInfoToast } from '../utils/toastHelper';
import './VerifyEmailPage.css';

function VerifyEmailPage() {
  const { token } = useParams();
  const [message, setMessage] = useState('Sedang memverifikasi email Anda...');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      showInfoToast('Memproses verifikasi email...');
      const verifyToken = async () => {
        try {
          const response = await verifyEmailToken(token);
          setMessage(response.data.message);
          showSuccessToast(response.data.message + ' Anda akan diarahkan ke halaman login.');
          
          setTimeout(() => {
            navigate('/login');
          }, 5000);

        } catch (err) {
          const errorMsg = err.response?.data?.message || 'Verifikasi gagal. Token mungkin tidak valid atau sudah kedaluwarsa.';
          setMessage(errorMsg);
          showErrorToast(errorMsg);
        }
      };
      verifyToken();
    } else {
      const errorMsg = 'Token verifikasi tidak ditemukan.';
      setMessage(errorMsg);
      showErrorToast(errorMsg);
    }
  }, [token, navigate]);

  return (
    <div className="verify-email-container">
      <div className="verify-email-box">
        <h1>Status Verifikasi Email</h1>
        <p className={`status-message ${message.includes('berhasil') ? 'status-success-inline' : message.includes('gagal') || message.includes('tidak valid') || message.includes('kedaluwarsa') || message.includes('tidak ditemukan') ? 'status-error-inline' : 'status-loading-inline'}`}>
            {message}
        </p>
        
        {(!message.includes('Sedang memverifikasi')) && (
          <Link to="/login" className="login-button-verify">Ke Halaman Login</Link>
        )}
      </div>
    </div>
  );
}

export default VerifyEmailPage;