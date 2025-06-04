// frontend/src/user/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
// Link tidak lagi dibutuhkan di sini jika navigasi utama via Sidebar
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from './userService';
import './ProfilePage.css'; // Kita akan banyak memodifikasi ini

function ProfilePage() {
  const { user: authUser, token, login: loginContext } = useAuth();
  const [profileData, setProfileData] = useState({
    namaLengkap: '',
    email: '',
    nomorWhatsAppNotifikasi: '',
    namaToko: ''
  });
  const [initialProfileData, setInitialProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(''); // Untuk notifikasi sukses
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setSuccessMessage('');
        const response = await getUserProfile();
        if (response.data.data) {
          setProfileData(response.data.data);
          setInitialProfileData(response.data.data);
        }
      } catch (err) {
        console.error("Gagal mengambil profil:", err);
        setError(err.response?.data?.message || "Gagal mengambil data profil.");
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError(null);
    setSuccessMessage('');
    if (initialProfileData) {
      setProfileData(initialProfileData);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage('');
    try {
      const response = await updateUserProfile(profileData);
      const updatedUserFromServer = response.data.data;
      setProfileData(updatedUserFromServer);
      setInitialProfileData(updatedUserFromServer);
      
      if (authUser && token && (authUser.email !== updatedUserFromServer.email || authUser.namaLengkap !== updatedUserFromServer.namaLengkap)) {
          loginContext({ token: token, user: updatedUserFromServer });
      }
      setIsEditing(false);
      setSuccessMessage('Profil berhasil diperbarui!'); // Notifikasi sukses
      // Hilangkan pesan sukses setelah beberapa detik
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error("Gagal update profil:", err);
      const errorMessage = err.response?.data?.message || "Gagal memperbarui profil.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !initialProfileData) { // Tampilkan loading hanya jika data awal belum ada
    return <div className="profile-page-loading"><p>Memuat profil...</p></div>;
  }

  // Error saat fetch awal dan belum ada data di state
  if (error && !initialProfileData && !authUser) { 
    return <div className="profile-page-error"><p style={{ color: 'red' }}>Error: {error}</p></div>;
  }

  return (
    <div className="profile-page"> {/* Class utama untuk halaman profil */}
      <div className="profile-header">
        <h1>Profil Saya</h1>
        {!isEditing && (
          <button onClick={() => { setIsEditing(true); setError(null); setSuccessMessage(''); }} className="button-edit-profile-header">
            Edit Profil
          </button>
        )}
      </div>

      {successMessage && <div className="profile-message success">{successMessage}</div>}
      {error && isEditing && <div className="profile-message error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="profile-card">
          <div className="profile-card-header">
            <h3>Informasi Akun</h3>
          </div>
          <div className="profile-card-body">
            <div className="form-group-profile">
              <label htmlFor="namaLengkap">Nama Lengkap</label>
              {isEditing ? (
                <input type="text" id="namaLengkap" name="namaLengkap" value={profileData.namaLengkap || ''} onChange={handleChange} required />
              ) : (
                <p>{profileData.namaLengkap || authUser?.namaLengkap || '-'}</p>
              )}
            </div>
            <div className="form-group-profile">
              <label htmlFor="email">Email</label>
              {isEditing ? (
                <input type="email" id="email" name="email" value={profileData.email || ''} onChange={handleChange} required />
              ) : (
                <p>{profileData.email || authUser?.email || '-'}</p>
              )}
            </div>
            <div className="form-group-profile">
              <label htmlFor="namaToko">Nama Toko</label>
              {isEditing ? (
                <input type="text" id="namaToko" name="namaToko" value={profileData.namaToko || ''} onChange={handleChange} />
              ) : (
                <p>{profileData.namaToko || authUser?.namaToko || '-'}</p>
              )}
            </div>
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-card-header">
            <h3>Pengaturan Notifikasi</h3>
          </div>
          <div className="profile-card-body">
            <div className="form-group-profile">
              <label htmlFor="nomorWhatsAppNotifikasi">Nomor WhatsApp Notifikasi</label>
              {isEditing ? (
                <input type="text" id="nomorWhatsAppNotifikasi" name="nomorWhatsAppNotifikasi" value={profileData.nomorWhatsAppNotifikasi || ''} onChange={handleChange} placeholder="Contoh: 6281234567890" required />
              ) : (
                <p>{profileData.nomorWhatsAppNotifikasi || '-'}</p>
              )}
            </div>
            {/* Di sini nanti bisa ditambahkan opsi channel notifikasi */}
          </div>
        </div>
        
        {isEditing && (
          <div className="profile-form-actions">
            <button type="button" onClick={handleCancelEdit} className="button-cancel-profile">
              Batal
            </button>
            <button type="submit" disabled={isLoading} className="button-save-profile">
              {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default ProfilePage;