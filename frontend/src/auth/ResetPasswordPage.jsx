import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from './authService';
import './LoginPage.css'; 

function ResetPasswordPage() {
  const { token } = useParams(); 
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Password baru dan konfirmasi password tidak cocok.');
      return;
    }
    if (password.length < 6) {
        setError('Password minimal harus 6 karakter.');
        return;
    }

    setIsLoading(true);
    try {
      const response = await resetPassword(token, password, confirmPassword);
      setMessage(response.message + ' Anda akan diarahkan ke halaman login.');
      setTimeout(() => {
        navigate('/login');
      }, 4000); 
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mereset password. Token mungkin tidak valid atau sudah kedaluwarsa.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Reset Password Anda</h2>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="password">Password Baru</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">Konfirmasi Password Baru</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Menyimpan...' : 'Reset Password'}
          </button>
        </form>
         {(message || error) && (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
                <Link to="/login">Ke Halaman Login</Link>
            </p>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;