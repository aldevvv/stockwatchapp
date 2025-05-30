import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import './VerifyEmailPage.css'; 

function VerifyEmailPage() {
  const { token } = useParams();
  const [verificationStatus, setVerificationStatus] = useState('loading'); 
  const [message, setMessage] = useState('Sedang memverifikasi email Anda...');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const verifyToken = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/auth/verify-email/${token}`);
          setVerificationStatus('success');
          setMessage(response.data.message);

          setTimeout(() => {
            navigate('/login');
          }, 10000); 

        } catch (err) {
          setVerificationStatus('error');
          setMessage(err.response?.data?.message || 'Verifikasi gagal. Token mungkin tidak valid atau sudah kedaluwarsa.');
        }
      };
      verifyToken();
    } else {
      setVerificationStatus('error');
      setMessage('Token verifikasi tidak ditemukan.');
    }
  }, [token, navigate]);

  return (
    <div className="verify-email-container">
      <div className="verify-email-box">
        <h1>Status Verifikasi Email</h1>
        {verificationStatus === 'loading' && <p className="status-loading">{message}</p>}
        {verificationStatus === 'success' && <p className="status-success">{message} Anda akan diarahkan ke halaman login dalam 5 detik.</p>}
        {verificationStatus === 'error' && <p className="status-error">{message}</p>}

        {(verificationStatus === 'success' || verificationStatus === 'error') && (
          <Link to="/login" className="login-button-verify">Ke Halaman Login</Link>
        )}
      </div>
    </div>
  );
}

export default VerifyEmailPage;