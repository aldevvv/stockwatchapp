import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from './authService';
import './LoginPage.css'; 

function RequestPasswordResetPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);
    try {
      const response = await requestPasswordReset(email);
      setMessage(response.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container"> 
      <div className="login-form"> 
        <h2>Lupa Password</h2>
        <p style={{ marginBottom: '20px', textAlign: 'center', color: '#666' }}>
          Masukkan alamat email Anda. Kami akan mengirimkan link untuk mereset password Anda.
        </p>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Mengirim...' : 'Kirim Link Reset'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/login">Kembali ke Login</Link>
        </p>
      </div>
    </div>
  );
}

export default RequestPasswordResetPage;