// frontend\src\pages\ContactPage.jsx
import React, { useState } from 'react';
import { sendContactMessage } from '../contact/contactService'; 
import { showSuccessToast, showErrorToast } from '../utils/toastHelper'; 
import './ContactPage.css';

// --- Komponen Ikon (tidak ada perubahan di sini) ---
const EmailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
);
const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);
const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
// ---------------------------------------------------

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- PERUBAHAN UTAMA ADA DI FUNGSI INI ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Memanggil fungsi sendContactMessage dengan data dari form
      const response = await sendContactMessage(formData);
      
      // 2. Menampilkan notifikasi sukses menggunakan toast
      showSuccessToast('Pesan Anda telah berhasil dikirim!');

      // 3. Mengosongkan form setelah berhasil terkirim
      setFormData({ name: '', email: '', subject: '', message: '' });

      console.log('Respon dari server:', response.data);

    } catch (error) {
      // 4. Menampilkan notifikasi error jika pengiriman gagal
      showErrorToast('Gagal mengirim pesan. Silakan coba lagi.');
      console.error('Error saat mengirim pesan:', error);

    } finally {
      // 5. Mengubah status submitting kembali ke false
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page-container">
      <div className="contact-header">
        <h1>Hubungi Kami</h1>
        <p>Punya pertanyaan, saran, atau butuh bantuan? Kami siap mendengarkan.</p>
      </div>
      <div className="contact-content-wrapper">
        <div className="contact-info-side">
          <h3>Informasi Kontak</h3>
          <p>Anda dapat menghubungi kami melalui detail di bawah ini. Tim kami akan segera merespons Anda.</p>
          <div className="info-item">
            <div className="info-icon"><EmailIcon /></div>
            <div>
              <h4>Email</h4>
              <p>support@stockwatch.web.id</p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon"><PhoneIcon /></div>
            <div>
              <h4>WhatsApp</h4>
              <p>+62 896 4314 3750</p>
            </div>
          </div>
          <div className="social-media-section">
            <h4>Ikuti Kami</h4>
            <div className="social-media-links">
                <a href="https://www.instagram.com/stockwatch_id" target="_blank" rel="noopener noreferrer" className="social-link"><InstagramIcon /></a>
                <a href="https://web.facebook.com/profile.php?id=61576338525140" target="_blank" rel="noopener noreferrer" className="social-link"><FacebookIcon /></a>
            </div>
          </div>
          <div className="map-section">
            <h4>Lokasi Kami</h4>
            <p>Jl. Cokonuri Dalam 1, Gn. Sari, Kec. Rappocini, Kota Makassar</p>
            <div className="map-responsive-container">
                {/* Sedikit perbaikan pada link Google Maps */}
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.714436577322!2d119.4361556747599!3d-5.148785894819717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbee2a382894a45%3A0xac3478954460f38b!2sJl.%20Cokonuri%20Dalam%20I%2C%20Gn.%20Sari%2C%20Kec.%20Rappocini%2C%20Kota%20Makassar%2C%20Sulawesi%20Selatan!5e0!3m2!1sid!2sid!4v1717646535921!5m2!1sid!2sid"
                    height="250" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Peta Lokasi StockWatch">
                </iframe>
            </div>
          </div>
        </div>
        <div className="contact-form-side">
          <h3>Kirim Pesan Langsung</h3>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Nama Anda</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Anda</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subjek</label>
              <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Pesan Anda</label>
              <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows="6" required></textarea>
            </div>
            <button type="submit" className="button-submit-contact" disabled={isSubmitting}>
              {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;