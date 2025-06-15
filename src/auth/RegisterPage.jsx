import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!termsAccepted) {
      showErrorToast('Anda harus menyetujui Syarat & Ketentuan untuk mendaftar.');
      return;
    }
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
      
      showSuccessToast(response.message);
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
    <div className="auth-page-container">
      <div className="auth-branding-side">
        <div className="branding-content">
          <h1 className="branding-title">Bergabung dengan Ribuan UMKM Cerdas</h1>
          <p className="branding-subtitle">Mulai kelola inventaris Anda dengan lebih efisien dan lihat bisnis Anda tumbuh bersama kami.</p>
        </div>
      </div>
      <div className="auth-form-side">
        <div className="auth-form-wrapper">
          <Link to="/">
            <img src="/Logo.png" alt="StockWatch Logo" className="auth-form-logo" />
          </Link>
          <div className="form-header">
            <h2>Buat Akun Baru</h2>
            <p>Daftar gratis untuk mulai mengelola stok Anda hari ini.</p>
          </div>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label htmlFor="namaLengkap">Nama Lengkap Anda</label>
              <input type="text" id="namaLengkap" name="namaLengkap" autoComplete="name" value={formData.namaLengkap} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label htmlFor="namaToko">Nama Toko / Usaha</label>
              <input type="text" id="namaToko" name="namaToko" autoComplete="organization" value={formData.namaToko} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" autoComplete="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label htmlFor="nomorWhatsAppNotifikasi">Nomor WhatsApp</label>
              <input type="text" id="nomorWhatsAppNotifikasi" name="nomorWhatsAppNotifikasi" autoComplete="tel" value={formData.nomorWhatsAppNotifikasi} onChange={handleChange} placeholder="Contoh: 6281234567890" required />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" autoComplete="new-password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label htmlFor="confirmPassword">Konfirmasi Password</label>
              <input type="password" id="confirmPassword" name="confirmPassword" autoComplete="new-password" value={formData.confirmPassword} onChange={handleChange} required />
            </div>

            <div className="terms-group">
              <input type="checkbox" id="terms" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
              <label htmlFor="terms">
                Saya setuju dengan <Link to="/terms" target="_blank">Syarat & Ketentuan</Link> dan <Link to="/privacypolicy" target="_blank">Kebijakan Privasi</Link>.
              </label>
            </div>

            <button type="submit" className="auth-button" disabled={isLoading || !termsAccepted}>
              {isLoading ? 'Mendaftar...' : 'Daftar Sekarang'}
            </button>
          </form>
          <p className="auth-switch-link">
            Sudah punya akun? <Link to="/login">Login di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;