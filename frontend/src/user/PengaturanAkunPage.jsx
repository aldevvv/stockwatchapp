import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile, changePassword as changePasswordService, uploadProfilePicture as uploadProfilePictureService } from './userService';
import { showSuccessToast, showErrorToast } from '../utils/toastHelper';
import '../styles/DashboardPages.css';
import './PengaturanPages.css';

function PengaturanAkunPage() {
    const { user: authUser, token, login: loginContext } = useAuth();
    const [profileData, setProfileData] = useState({});
    const [passwordData, setPasswordData] = useState({ passwordLama: '', passwordBaru: '', konfirmasiPasswordBaru: '' });
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [imageUpload, setImageUpload] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const response = await getUserProfile();
          setProfileData(response.data.data || {});
        } catch (err) {
          showErrorToast("Gagal mengambil data profil.");
        }
      };
      if (token) fetchProfile();
    }, [token]);

    const handleProfileChange = (e) => setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handlePasswordChange = (e) => setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleImageChange = (e) => { if (e.target.files[0]) setImageUpload(e.target.files[0]); };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsUpdatingProfile(true);
        try {
            const response = await updateUserProfile(profileData);
            const updatedUser = response.data.data;
            loginContext({ token, user: { ...authUser, ...updatedUser } });
            showSuccessToast('Profil berhasil diperbarui!');
        } catch (err) { showErrorToast(err.response?.data?.message || "Gagal memperbarui profil.");
        } finally { setIsUpdatingProfile(false); }
    };

    const handleChangePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.passwordBaru !== passwordData.konfirmasiPasswordBaru) return showErrorToast('Password baru tidak cocok.');
        setIsChangingPassword(true);
        try {
            await changePasswordService({ passwordLama: passwordData.passwordLama, passwordBaru: passwordData.passwordBaru });
            showSuccessToast('Password berhasil diubah!');
            setPasswordData({ passwordLama: '', passwordBaru: '', konfirmasiPasswordBaru: '' });
        } catch (err) { showErrorToast(err.response?.data?.message || "Gagal mengubah password.");
        } finally { setIsChangingPassword(false); }
    };
    
    const handleUploadAndSave = async () => {
        if (!imageUpload) return showErrorToast("Pilih file gambar terlebih dahulu.");
        setIsUploading(true);
        try {
            const response = await uploadProfilePictureService(imageUpload);
            const updatedProfile = response.data.userProfile;
            loginContext({ token: token, user: updatedProfile });
            showSuccessToast(response.data.message);
            setImageUpload(null);
            setProfileData(updatedProfile);
        } catch (error) { showErrorToast(error.response?.data?.message || "Gagal mengunggah foto.");
        } finally { setIsUploading(false); }
    };

    return (
        <div className="pengaturan-card-container">
            <div className="pengaturan-card">
                <div className="pengaturan-card-header"><h3>Foto & Detail Profil</h3></div>
                <div className="pengaturan-card-body">
                    <div className="profile-picture-section">
                        <img src={profileData.fotoProfilUrl || 'https://www.iconpacks.net/icons/2/free-user-icon-3297-thumb.png'} alt="Foto Profil" className="profile-picture-preview"/>
                        <input type="file" onChange={handleImageChange} ref={fileInputRef} style={{ display: 'none' }} accept="image/png, image/jpeg"/>
                        <div className="profile-picture-actions">
                            <button type="button" onClick={() => fileInputRef.current.click()} className="button-secondary">Pilih Gambar</button>
                            <button type="button" onClick={handleUploadAndSave} className="button-add" disabled={!imageUpload || isUploading}>{isUploading ? 'Mengunggah...' : 'Upload'}</button>
                        </div>
                        {imageUpload && <p className="file-selected-info">File dipilih : {imageUpload.name}</p>}
                    </div>
                    <hr className="pengaturan-divider" />
                    <form onSubmit={handleProfileSubmit}>
                        <div className="form-group"><label>Nama Lengkap</label><input type="text" name="namaLengkap" value={profileData.namaLengkap || ''} onChange={handleProfileChange} required /></div>
                        <div className="form-group"><label>Email</label><input type="email" name="email" value={profileData.email || ''} onChange={handleProfileChange} required /></div>
                        <div className="form-group"><label>Nama Toko</label><input type="text" name="namaToko" value={profileData.namaToko || ''} onChange={handleProfileChange} /></div>
                        <div className="form-group"><label>Nomor WhatsApp</label><input type="text" name="nomorWhatsAppNotifikasi" value={profileData.nomorWhatsAppNotifikasi || ''} onChange={handleProfileChange} required/></div>
                        <div className="pengaturan-card-footer"><button type="submit" className="button-save-profile" disabled={isUpdatingProfile}>{isUpdatingProfile ? 'Menyimpan...' : 'Simpan Profil'}</button></div>
                    </form>
                </div>
            </div>
            <div className="pengaturan-card">
                <div className="pengaturan-card-header"><h3>Ubah Password</h3></div>
                <div className="pengaturan-card-body">
                    <form onSubmit={handleChangePasswordSubmit}>
                        <div className="form-group"><label>Password Lama</label><input type="password" name="passwordLama" value={passwordData.passwordLama} onChange={handlePasswordChange} required /></div>
                        <div className="form-group"><label>Password Baru</label><input type="password" name="passwordBaru" value={passwordData.passwordBaru} onChange={handlePasswordChange} required /></div>
                        <div className="form-group"><label>Konfirmasi Password Baru</label><input type="password" name="konfirmasiPasswordBaru" value={passwordData.konfirmasiPasswordBaru} onChange={handlePasswordChange} required /></div>
                        <div className="pengaturan-card-footer"><button type="submit" className="button-save-profile" disabled={isChangingPassword}>{isChangingPassword ? 'Memperbarui...' : 'Ubah Password'}</button></div>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default PengaturanAkunPage;