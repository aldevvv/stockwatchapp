import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile, changePassword as changePasswordService } from './userService'; 
import { showSuccessToast, showErrorToast } from '../utils/toastHelper';
import './PengaturanPage.css';

function PengaturanPage() { 
  const { user: authUser, token, login: loginContext } = useAuth();
  const [profileData, setProfileData] = useState({
    namaLengkap: '',
    email: '',
    nomorWhatsAppNotifikasi: '',
    namaToko: '',
    preferensiNotifikasiEmail: true,
    preferensiNotifikasiWhatsApp: true
  });
  const [initialProfileData, setInitialProfileData] = useState(null);
  
  const [passwordData, setPasswordData] = useState({
    passwordLama: '',
    passwordBaru: '',
    konfirmasiPasswordBaru: ''
  });

  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [errorProfile, setErrorProfile] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);
  
  const [activeSubMenu, setActiveSubMenu] = useState('profil');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoadingProfile(true);
        setErrorProfile(null);
        const response = await getUserProfile();
        if (response.data.data) {
          const fetchedProfile = {
            ...response.data.data,
            preferensiNotifikasiEmail: response.data.data.hasOwnProperty('preferensiNotifikasiEmail') 
                                        ? response.data.data.preferensiNotifikasiEmail 
                                        : true,
            preferensiNotifikasiWhatsApp: response.data.data.hasOwnProperty('preferensiNotifikasiWhatsApp') 
                                          ? response.data.data.preferensiNotifikasiWhatsApp 
                                          : true,
          };
          setProfileData(fetchedProfile);
          setInitialProfileData(fetchedProfile);
        }
      } catch (err) {
        console.error("Gagal mengambil profil:", err);
        const fetchErrorMsg = err.response?.data?.message || "Gagal mengambil data profil.";
        setErrorProfile(fetchErrorMsg);
        showErrorToast(fetchErrorMsg);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
    }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setErrorProfile(null);
    try {
      const response = await updateUserProfile(profileData);
      const updatedUserFromServer = response.data.data;
      setProfileData(updatedUserFromServer);
      setInitialProfileData(updatedUserFromServer);
      
      if (authUser && token && (authUser.email !== updatedUserFromServer.email || authUser.namaLengkap !== updatedUserFromServer.namaLengkap)) {
          loginContext({ token: token, user: updatedUserFromServer });
      }
      showSuccessToast('Perubahan berhasil disimpan!');
    } catch (err) {
      console.error("Gagal update profil:", err);
      const errorMessage = err.response?.data?.message || "Gagal memperbarui profil.";
      setErrorProfile(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorPassword(null);

    if (passwordData.passwordBaru !== passwordData.konfirmasiPasswordBaru) {
      showErrorToast('Password baru dan konfirmasi password tidak cocok.');
      return;
    }
    if (passwordData.passwordBaru.length < 6) {
      showErrorToast('Password baru minimal harus 6 karakter.');
      return;
    }
    
    setIsChangingPassword(true);
    try {
      await changePasswordService({
        passwordLama: passwordData.passwordLama,
        passwordBaru: passwordData.passwordBaru,
        konfirmasiPasswordBaru: passwordData.konfirmasiPasswordBaru,
      });
      showSuccessToast('Password berhasil diubah!');
      setPasswordData({ passwordLama: '', passwordBaru: '', konfirmasiPasswordBaru: '' });
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Gagal mengubah password.";
      setErrorPassword(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="pengaturan-page">
        <div className="page-loading">
          <p>Memuat pengaturan...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pengaturan-page">
      <div className="pengaturan-header">
        <h1>Pengaturan Akun</h1>
      </div>

      <div className="pengaturan-submenu-nav">
        <button 
          className={`submenu-button ${activeSubMenu === 'profil' ? 'active' : ''}`}
          onClick={() => setActiveSubMenu('profil')}
        >
          Profil Akun
        </button>
        <button 
          className={`submenu-button ${activeSubMenu === 'keamanan' ? 'active' : ''}`}
          onClick={() => setActiveSubMenu('keamanan')}
        >
          Keamanan Akun
        </button>
        <button 
          className={`submenu-button ${activeSubMenu === 'notifikasi' ? 'active' : ''}`}
          onClick={() => setActiveSubMenu('notifikasi')}
        >
          Preferensi Notifikasi
        </button>
      </div>

      <div className="pengaturan-content">
        {activeSubMenu === 'profil' && (
          <form onSubmit={handleProfileSubmit}>
            <div className="pengaturan-card">
              <div className="pengaturan-card-header">
                <h3>Detail Profil</h3>
              </div>
              <div className="pengaturan-card-body">
                {errorProfile && !isUpdatingProfile && <p className="error-message-inline">{errorProfile}</p>}
                <div className="form-group-pengaturan">
                  <label htmlFor="namaLengkap">Nama Lengkap</label>
                  <input type="text" id="namaLengkap" name="namaLengkap" value={profileData.namaLengkap || ''} onChange={handleProfileChange} required />
                </div>
                <div className="form-group-pengaturan">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" value={profileData.email || ''} onChange={handleProfileChange} required />
                </div>
                <div className="form-group-pengaturan">
                  <label htmlFor="namaToko">Nama Toko</label>
                  <input type="text" id="namaToko" name="namaToko" value={profileData.namaToko || ''} onChange={handleProfileChange} />
                </div>
                 <div className="form-group-pengaturan">
                  <label htmlFor="nomorWhatsAppNotifikasi">Nomor WhatsApp Notifikasi</label>
                  <input type="text" id="nomorWhatsAppNotifikasi" name="nomorWhatsAppNotifikasi" value={profileData.nomorWhatsAppNotifikasi || ''} onChange={handleProfileChange} placeholder="Contoh: 6281234567890" required />
                </div>
              </div>
              <div className="pengaturan-card-footer">
                <button type="submit" disabled={isUpdatingProfile} className="button-save-profile">
                  {isUpdatingProfile ? 'Menyimpan...' : 'Simpan Detail Profil'}
                </button>
              </div>
            </div>
          </form>
        )}

        {activeSubMenu === 'keamanan' && (
          <form onSubmit={handleChangePasswordSubmit}>
            <div className="pengaturan-card keamanan">
              <div className="pengaturan-card-header">
                <h3>Ubah Password</h3>
              </div>
              <div className="pengaturan-card-body">
                {errorPassword && !isChangingPassword && <p className="error-message-inline">{errorPassword}</p>}
                <div className="form-group-pengaturan">
                  <label htmlFor="passwordLama">Password Lama</label>
                  <input type="password" id="passwordLama" name="passwordLama" value={passwordData.passwordLama} onChange={handlePasswordChange} required />
                </div>
                <div className="form-group-pengaturan">
                  <label htmlFor="passwordBaru">Password Baru</label>
                  <input type="password" id="passwordBaru" name="passwordBaru" value={passwordData.passwordBaru} onChange={handlePasswordChange} required />
                </div>
                <div className="form-group-pengaturan">
                  <label htmlFor="konfirmasiPasswordBaru">Konfirmasi Password Baru</label>
                  <input type="password" id="konfirmasiPasswordBaru" name="konfirmasiPasswordBaru" value={passwordData.konfirmasiPasswordBaru} onChange={handlePasswordChange} required />
                </div>
              </div>
              <div className="pengaturan-card-footer">
                <button type="submit" disabled={isChangingPassword} className="button-save-profile">
                  {isChangingPassword ? 'Memperbarui...' : 'Ubah Password'}
                </button>
              </div>
            </div>
          </form>
        )}

        {activeSubMenu === 'notifikasi' && (
          <form onSubmit={handleProfileSubmit}>
            <div className="pengaturan-card">
              <div className="pengaturan-card-header">
                <h3>Preferensi Notifikasi</h3>
              </div>
              <div className="pengaturan-card-body">
                 <div className="form-group-pengaturan-checkbox">
                  <input 
                    type="checkbox" 
                    id="preferensiNotifikasiEmail" 
                    name="preferensiNotifikasiEmail" 
                    checked={profileData.preferensiNotifikasiEmail} 
                    onChange={handleProfileChange} 
                  />
                  <label htmlFor="preferensiNotifikasiEmail">Terima Notifikasi via Email</label>
                </div>
                <div className="form-group-pengaturan-checkbox">
                  <input 
                    type="checkbox" 
                    id="preferensiNotifikasiWhatsApp" 
                    name="preferensiNotifikasiWhatsApp" 
                    checked={profileData.preferensiNotifikasiWhatsApp} 
                    onChange={handleProfileChange} 
                  />
                  <label htmlFor="preferensiNotifikasiWhatsApp">Terima Notifikasi via WhatsApp</label>
                </div>
              </div>
              <div className="pengaturan-card-footer">
                 <button type="submit" disabled={isUpdatingProfile} className="button-save-profile">
                  {isUpdatingProfile ? 'Menyimpan...' : 'Simpan Preferensi'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
export default PengaturanPage;