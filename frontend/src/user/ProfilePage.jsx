import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from './userService';
import './ProfilePage.css';

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
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
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
    if (initialProfileData) {
      setProfileData(initialProfileData);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await updateUserProfile(profileData);
      alert('Profil berhasil diperbarui!');
      const updatedUserFromServer = response.data.data;
      setProfileData(updatedUserFromServer);
      setInitialProfileData(updatedUserFromServer);
      
      if (authUser && (authUser.email !== updatedUserFromServer.email || authUser.namaLengkap !== updatedUserFromServer.namaLengkap)) {
          loginContext({ token: token, user: updatedUserFromServer });
      }
      setIsEditing(false);
    } catch (err) {
      console.error("Gagal update profil:", err);
      const errorMessage = err.response?.data?.message || "Gagal memperbarui profil.";
      setError(errorMessage);
      alert(`Gagal memperbarui profil: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !initialProfileData && !isEditing) {
    return <p>Memuat profil...</p>;
  }

  if (error && !initialProfileData && !isEditing && !authUser) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  return (
    <div className="profile-page-content">
      <h1>Profil Pengguna</h1>
      {error && isEditing && <p className="error-message">{error}</p>} 
      
      {!isEditing ? (
        <div className="profile-display">
          <p><strong>Nama Lengkap:</strong> {profileData.namaLengkap || authUser?.namaLengkap || '-'}</p>
          <p><strong>Email:</strong> {profileData.email || authUser?.email || '-'}</p>
          <p><strong>Nama Toko:</strong> {profileData.namaToko || authUser?.namaToko || '-'}</p>
          <p><strong>Nomor WhatsApp Notifikasi:</strong> {profileData.nomorWhatsAppNotifikasi || '-'}</p>
          <div className="profile-actions">
            <button onClick={() => { setIsEditing(true); setError(null); }} className="button-edit-profile">Edit Profil</button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="namaLengkap">Nama Lengkap Anda</label>
            <input type="text" id="namaLengkap" name="namaLengkap" value={profileData.namaLengkap || ''} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={profileData.email || ''} onChange={handleChange} required />
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