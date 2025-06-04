import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from './authService';
import { showSuccessToast, showErrorToast } from '../utils/toastHelper';
import './RegisterPage.css';

function RegisterPage() {
  const [formData, setFormData] = useState({
    namaLengkap: '',
    namaToko: '',
    email: '',
    nomorWhatsAppNotifikasi: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showErrorToast('Password dan konfirmasi password tidak cocok.');
      return;
    }
    if (formData.password.length < 6) {
        showErrorToast('Password minimal harus 6 karakter.');
        return;
    }
    
    setIsLoading(true);
    try {
      const response = await registerUser({
        namaLengkap: formData.namaLengkap,
        namaToko: formData.namaToko,
        email: formData.email,
        nomorWhatsAppNotifikasi: formData.nomorWhatsAppNotifikasi,
        password: formData.password
      });
      
      showSuccessToast(response.message + ' Anda akan diarahkan ke halaman login.');
      setTimeout(() => {
        navigate('/login');
      }, 3000); 

    } catch (err) {
      const registerErrorMsg = err.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.';
      showErrorToast(registerErrorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Daftar Akun StockWatch</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="namaLengkap">Nama Lengkap Anda</label>
            <input type="text" id="namaLengkap" name="namaLengkap" value={formData.namaLengkap} onChange={handleChange} required />
          </div>
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