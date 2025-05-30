// frontend/src/auth/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Nanti kita buat fungsi register di authService
// import { register } from './authService'; 
import axios from 'axios'; // Kita gunakan axios langsung dulu untuk kesederhanaan
import './RegisterPage.css'; // Kita akan buat file CSS ini

function RegisterPage() {
  const [formData, setFormData] = useState({
    namaToko: '',
    email: '',
    nomorWhatsAppNotifikasi: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      return;
    }

    setIsLoading(true);
    try {
      // Langsung panggil API backend (nanti bisa dipindah ke authService.js)
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        namaToko: formData.namaToko,
        email: formData.email,
        nomorWhatsAppNotifikasi: formData.nomorWhatsAppNotifikasi,
        password: formData.password
      });

      setSuccess(response.data.message + ' Anda akan diarahkan ke halaman login.');
      setTimeout(() => {
        navigate('/login');
      }, 3000); // Arahkan ke login setelah 3 detik

    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Daftar Akun StockWatch</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="namaToko">Nama Toko</label>
            <input type="text" id="namaToko" name="namaToko" value={formData.namaToko} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label htmlFor="nomorWhatsAppNotifikasi">Nomor WhatsApp (untuk Notifikasi)</label>
            <input type="text" id="nomorWhatsAppNotifikasi" name="nomorWhatsAppNotifikasi" value={formData.nomorWhatsAppNotifikasi} onChange={handleChange} placeholder="Contoh: 6281234567890" required />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">Konfirmasi Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          </div>
          <button type="submit" className="register-button" disabled={isLoading}>
            {isLoading ? 'Mendaftar...' : 'Daftar'}
          </button>
        </form>
        <p className="login-link">
          Sudah punya akun? <Link to="/login">Login di sini</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;