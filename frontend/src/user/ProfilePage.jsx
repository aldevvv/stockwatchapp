import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from './userService';
import './ProfilePage.css';

function ProfilePage() {
  const { user, token } = useAuth();
  const [profileData, setProfileData] = useState({
    email: '',
    nomorWhatsAppNotifikasi: '',
    namaToko: ''
  });
  const [initialProfileData, setInitialProfileData] = useState(null); // Untuk reset saat batal
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await getUserProfile();
        if (response.data.data) {
          setProfileData(response.data.data);
          setInitialProfileData(response.data.data); // Simpan data awal
        }
        setError(null);
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
    if (initialProfileData) {
      setProfileData(initialProfileData); // Kembalikan ke data awal saat batal
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Bisa juga menggunakan state 'isUpdating' terpisah
    setError(null);
    try {
      const response = await updateUserProfile(profileData);
      alert('Profil berhasil diperbarui!');
      setProfileData(response.data.data);
      setInitialProfileData(response.data.data); // Update juga data awal
      setIsEditing(false);
    } catch (err) {
      console.error("Gagal update profil:", err);
      setError(err.response?.data?.message || "Gagal memperbarui profil.");
      // alert akan muncul dari FE jika ada error di BE, atau kita bisa set error state saja
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !initialProfileData && !isEditing) {
    return <p>Memuat profil...</p>;
  }

  // Error saat fetch awal
  if (error && !initialProfileData && !isEditing) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  return (
    <div className="profile-container">
      <h1>Profil Pengguna</h1>
      {error && isEditing && <p className="error-message">{error}</p>} 
      
      {!isEditing ? (
        <div className="profile-display">
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>Nama Toko:</strong> {profileData.namaToko || '-'}</p>
          <p><strong>Nomor WhatsApp Notifikasi:</strong> {profileData.nomorWhatsAppNotifikasi || '-'}</p>
          <div className="profile-actions">
            <Link to="/dashboard" className="button-back-to-dashboard">Kembali ke Dashboard</Link>
            <button onClick={() => { setIsEditing(true); setError(null); }} className="button-edit-profile">Edit Profil</button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={profileData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="namaToko">Nama Toko</label>
            <input type="text" id="namaToko" name="namaToko" value={profileData.namaToko || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="nomorWhatsAppNotifikasi">Nomor WhatsApp Notifikasi</label>
            <input type="text" id="nomorWhatsAppNotifikasi" name="nomorWhatsAppNotifikasi" value={profileData.nomorWhatsAppNotifikasi || ''} onChange={handleChange} placeholder="Contoh: 6281234567890" required />
          </div>
          <div className="form-actions">
            <Link to="/dashboard" className="button-back-to-dashboard" style={{marginRight: 'auto'}}>Kembali ke Dashboard</Link>
            <button type="button" onClick={handleCancelEdit} className="button-cancel">Batal</button>
            <button type="submit" disabled={isLoading} className="button-save">
              {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ProfilePage;