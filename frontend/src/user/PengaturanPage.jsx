import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile, changePassword as changePasswordService, deleteUserAccount } from './userService'; 
import { deleteAllStok } from '../stok/stokService';
import { deleteAllSuppliers } from '../supplier/supplierService';
import { showSuccessToast, showErrorToast } from '../utils/toastHelper';
import { storage } from '../firebase-config';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Modal from '../components/Modal';
import './PengaturanPage.css';

function PengaturanPage() { 
  const { user: authUser, token, login: loginContext, logout } = useAuth();
  const [profileData, setProfileData] = useState({
    namaLengkap: '',
    email: '',
    nomorWhatsAppNotifikasi: '',
    namaToko: '',
    preferensiNotifikasiEmail: true,
    preferensiNotifikasiWhatsApp: true,
    fotoProfilUrl: ''
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
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [errorProfile, setErrorProfile] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);
  
  const [activeSubMenu, setActiveSubMenu] = useState('profil');

  const [imageUpload, setImageUpload] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [isDeleteStockModalOpen, setIsDeleteStockModalOpen] = useState(false);
  const [isDeleteSuppliersModalOpen, setIsDeleteSuppliersModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [passwordForDelete, setPasswordForDelete] = useState('');

  const fetchProfileCallback = useCallback(async () => {
    if (!token) return;
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
      const fetchErrorMsg = err.response?.data?.message || "Gagal mengambil data profil.";
      setErrorProfile(fetchErrorMsg);
      showErrorToast(fetchErrorMsg);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProfileCallback();
  }, [fetchProfileCallback]);

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
      
      if (authUser && token) {
          loginContext({ token: token, user: updatedUserFromServer });
      }
      showSuccessToast('Perubahan berhasil disimpan!');
    } catch (err) {
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

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
        setImageUpload(e.target.files[0]);
    }
  };

  const handleUploadAndSave = async () => {
    if (!imageUpload) {
        showErrorToast("Silakan pilih file gambar terlebih dahulu.");
        return;
    }
    if (!authUser?.id) {
        showErrorToast("User ID tidak ditemukan. Silakan login ulang.");
        return;
    }

    setIsUploading(true);
    try {
        const response = await uploadProfilePicture(imageUpload);
        const updatedProfile = response.data.userProfile;

        loginContext({ token: token, user: updatedProfile });
        
        showSuccessToast(response.data.message);
        setImageUpload(null);
        setProfileData(updatedProfile);
        setInitialProfileData(updatedProfile);
    } catch (error) {
        console.error("Gagal mengunggah foto:", error);
        showErrorToast(error.response?.data?.message || "Gagal mengunggah foto.");
    } finally {
        setIsUploading(false);
    }
  };

  const handleOpenDeleteModal = (type) => {
    if (type === 'stok') setIsDeleteStockModalOpen(true);
    if (type === 'supplier') setIsDeleteSuppliersModalOpen(true);
    if (type === 'akun') setIsDeleteAccountModalOpen(true);
  };

  const handleCloseAllModals = () => {
    setIsDeleteStockModalOpen(false);
    setIsDeleteSuppliersModalOpen(false);
    setIsDeleteAccountModalOpen(false);
    setPasswordForDelete('');
  };

  const handleConfirmDeleteAllStock = async () => {
    if (!passwordForDelete) {
        showErrorToast('Silakan masukkan password Anda untuk konfirmasi.');
        return;
    }
    setIsDeleting(true);
    try {
        const response = await deleteAllStok(passwordForDelete);
        showSuccessToast(response.data.message);
        handleCloseAllModals();
    } catch (err) {
        showErrorToast(err.response?.data?.message || 'Gagal menghapus stok.');
    } finally {
        setIsDeleting(false);
    }
  };

  const handleConfirmDeleteAllSuppliers = async () => {
    if (!passwordForDelete) {
        showErrorToast('Silakan masukkan password Anda untuk konfirmasi.');
        return;
    }
    setIsDeleting(true);
    try {
        const response = await deleteAllSuppliers(passwordForDelete);
        showSuccessToast(response.data.message);
        handleCloseAllModals();
    } catch (err) {
        showErrorToast(err.response?.data?.message || 'Gagal menghapus supplier.');
    } finally {
        setIsDeleting(false);
    }
  };

  const handleConfirmDeleteAccount = async () => {
    if (!passwordForDelete) {
        showErrorToast('Silakan masukkan password Anda untuk konfirmasi.');
        return;
    }
    setIsDeleting(true);
    try {
        const response = await deleteUserAccount(passwordForDelete);
        showSuccessToast(response.data.message + " Anda akan diarahkan ke halaman utama.");
        handleCloseAllModals();
        setTimeout(() => {
            logout();
        }, 3000);
    } catch (err) {
        showErrorToast(err.response?.data?.message || 'Gagal menghapus akun.');
    } finally {
        setIsDeleting(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="pengaturan-page">
        <div className="page-loading"><p>Memuat pengaturan...</p></div>
      </div>
    );
  }
  
  return (
    <div className="pengaturan-page">
      <div className="pengaturan-header"><h1>Pengaturan Akun</h1></div>

      <div className="pengaturan-submenu-nav">
        <button className={`submenu-button ${activeSubMenu === 'profil' ? 'active' : ''}`} onClick={() => setActiveSubMenu('profil')}>Profil Akun</button>
        <button className={`submenu-button ${activeSubMenu === 'keamanan' ? 'active' : ''}`} onClick={() => setActiveSubMenu('keamanan')}>Keamanan</button>
        <button className={`submenu-button ${activeSubMenu === 'notifikasi' ? 'active' : ''}`} onClick={() => setActiveSubMenu('notifikasi')}>Notifikasi</button>
        <button className={`submenu-button danger ${activeSubMenu === 'danger' ? 'active' : ''}`} onClick={() => setActiveSubMenu('danger')}>Zona Berbahaya</button>
      </div>

      <div className="pengaturan-content">
        {activeSubMenu === 'profil' && (
            <div className="pengaturan-card">
              <div className="pengaturan-card-header"><h3>Profil Akun</h3></div>
              <div className="pengaturan-card-body">
                <div className="profile-picture-section">
                    <img src={profileData.fotoProfilUrl || 'https://via.placeholder.com/150/e0e0e0/555?text=Foto'} alt="Foto Profil" className="profile-picture-preview"/>
                    <input type="file" onChange={handleImageChange} ref={fileInputRef} style={{ display: 'none' }} accept="image/png, image/jpeg"/>
                    <div className="profile-picture-actions">
                        <button type="button" onClick={() => fileInputRef.current.click()} className="button-change-pic">Pilih Gambar</button>
                        <button type="button" onClick={handleUploadAndSave} className="button-upload-pic" disabled={!imageUpload || isUploading}>{isUploading ? 'Mengunggah...' : 'Upload & Simpan'}</button>
                    </div>
                    {imageUpload && <p className="file-selected-info">File dipilih: {imageUpload.name}</p>}
                </div>
                <hr className="pengaturan-divider" />
                <form onSubmit={handleProfileSubmit}>
                    {errorProfile && !isUpdatingProfile && <p className="error-message-inline">{errorProfile}</p>}
                    <div className="form-group-pengaturan"><label htmlFor="namaLengkap">Nama Lengkap</label><input type="text" id="namaLengkap" name="namaLengkap" value={profileData.namaLengkap || ''} onChange={handleProfileChange} required /></div>
                    <div className="form-group-pengaturan"><label htmlFor="email">Email</label><input type="email" id="email" name="email" value={profileData.email || ''} onChange={handleProfileChange} required /></div>
                    <div className="form-group-pengaturan"><label htmlFor="namaToko">Nama Toko</label><input type="text" id="namaToko" name="namaToko" value={profileData.namaToko || ''} onChange={handleProfileChange} /></div>
                    <div className="form-group-pengaturan"><label htmlFor="nomorWhatsAppNotifikasi">Nomor WhatsApp Notifikasi</label><input type="text" id="nomorWhatsAppNotifikasi" name="nomorWhatsAppNotifikasi" value={profileData.nomorWhatsAppNotifikasi || ''} onChange={handleProfileChange} placeholder="Contoh: 6281234567890" required /></div>
                    <div className="pengaturan-card-footer"><button type="submit" disabled={isUpdatingProfile} className="button-save-profile">{isUpdatingProfile ? 'Menyimpan...' : 'Simpan Detail Profil'}</button></div>
                </form>
              </div>
            </div>
        )}

        {activeSubMenu === 'keamanan' && (
          <form onSubmit={handleChangePasswordSubmit}>
            <div className="pengaturan-card keamanan"><div className="pengaturan-card-header"><h3>Ubah Password</h3></div>
              <div className="pengaturan-card-body">
                {errorPassword && !isChangingPassword && <p className="error-message-inline">{errorPassword}</p>}
                <div className="form-group-pengaturan"><label htmlFor="passwordLama">Password Lama</label><input type="password" id="passwordLama" name="passwordLama" value={passwordData.passwordLama} onChange={handlePasswordChange} required /></div>
                <div className="form-group-pengaturan"><label htmlFor="passwordBaru">Password Baru</label><input type="password" id="passwordBaru" name="passwordBaru" value={passwordData.passwordBaru} onChange={handlePasswordChange} required /></div>
                <div className="form-group-pengaturan"><label htmlFor="konfirmasiPasswordBaru">Konfirmasi Password Baru</label><input type="password" id="konfirmasiPasswordBaru" name="konfirmasiPasswordBaru" value={passwordData.konfirmasiPasswordBaru} onChange={handlePasswordChange} required /></div>
              </div>
              <div className="pengaturan-card-footer"><button type="submit" disabled={isChangingPassword} className="button-save-profile">{isChangingPassword ? 'Memperbarui...' : 'Ubah Password'}</button></div>
            </div>
          </form>
        )}

        {activeSubMenu === 'notifikasi' && (
          <form onSubmit={handleProfileSubmit}>
            <div className="pengaturan-card"><div className="pengaturan-card-header"><h3>Preferensi Notifikasi</h3></div>
              <div className="pengaturan-card-body">
                 <div className="form-group-pengaturan-checkbox"><input type="checkbox" id="preferensiNotifikasiEmail" name="preferensiNotifikasiEmail" checked={profileData.preferensiNotifikasiEmail} onChange={handleProfileChange} /><label htmlFor="preferensiNotifikasiEmail">Terima Notifikasi via Email</label></div>
                 <div className="form-group-pengaturan-checkbox"><input type="checkbox" id="preferensiNotifikasiWhatsApp" name="preferensiNotifikasiWhatsApp" checked={profileData.preferensiNotifikasiWhatsApp} onChange={handleProfileChange} /><label htmlFor="preferensiNotifikasiWhatsApp">Terima Notifikasi via WhatsApp</label></div>
              </div>
              <div className="pengaturan-card-footer"><button type="submit" disabled={isUpdatingProfile} className="button-save-profile">{isUpdatingProfile ? 'Menyimpan...' : 'Simpan Preferensi'}</button></div>
            </div>
          </form>
        )}

        {activeSubMenu === 'danger' && (
          <div className="pengaturan-card danger-zone-card">
              <div className="pengaturan-card-header"><h3>Zona Berbahaya</h3></div>
              <div className="pengaturan-card-body">
                  <div className="danger-action"><div><strong>Hapus Semua Data Stok</strong><p>Tindakan ini akan menghapus seluruh daftar item stok Anda secara permanen. Aksi ini tidak dapat diurungkan.</p></div><button onClick={() => handleOpenDeleteModal('stok')} className="button-danger">Hapus Stok</button></div>
                  <hr className="danger-divider" />
                  <div className="danger-action"><div><strong>Hapus Semua Data Supplier</strong><p>Tindakan ini akan menghapus seluruh daftar supplier Anda secara permanen.</p></div><button onClick={() => handleOpenDeleteModal('supplier')} className="button-danger">Hapus Supplier</button></div>
                  <hr className="danger-divider" />
                  <div className="danger-action"><div><strong>Hapus Akun Anda</strong><p>Tindakan ini akan menghapus akun beserta seluruh data Anda secara permanen.</p></div><button onClick={() => handleOpenDeleteModal('akun')} className="button-danger">Hapus Akun</button></div>
              </div>
          </div>
        )}
      </div>
      
      <Modal title="Konfirmasi Hapus Semua Stok" isOpen={isDeleteStockModalOpen} onClose={handleCloseAllModals}>
        <div className="confirm-delete-modal">
            <p><strong>PERINGATAN:</strong> Anda akan menghapus semua data stok. Aksi ini tidak dapat diurungkan.</p>
            <p>Untuk melanjutkan, silakan masukkan password akun Anda di bawah ini dan klik "Konfirmasi Hapus".</p>
            <div className="form-group-pengaturan"><label htmlFor="passwordForDeleteStock">Password Anda</label><input type="password" id="passwordForDeleteStock" placeholder="Masukkan password Anda" value={passwordForDelete} onChange={(e) => setPasswordForDelete(e.target.value)} className="form-input-modal" /></div>
            <div className="modal-actions"><button onClick={handleCloseAllModals} className="button-cancel">Batal</button><button onClick={handleConfirmDeleteAllStock} className="button-danger" disabled={isDeleting}>{isDeleting ? 'Menghapus...' : 'Konfirmasi Hapus'}</button></div>
        </div>
      </Modal>

      <Modal title="Konfirmasi Hapus Semua Supplier" isOpen={isDeleteSuppliersModalOpen} onClose={handleCloseAllModals}>
        <div className="confirm-delete-modal">
            <p><strong>PERINGATAN:</strong> Anda akan menghapus semua data supplier. Aksi ini tidak dapat diurungkan.</p>
            <p>Masukkan password Anda untuk melanjutkan.</p>
            <div className="form-group-pengaturan"><label htmlFor="passwordForDeleteSupplier">Password Anda</label><input type="password" id="passwordForDeleteSupplier" placeholder="Masukkan password Anda" value={passwordForDelete} onChange={(e) => setPasswordForDelete(e.target.value)} className="form-input-modal" /></div>
            <div className="modal-actions"><button onClick={handleCloseAllModals} className="button-cancel">Batal</button><button onClick={handleConfirmDeleteAllSuppliers} className="button-danger" disabled={isDeleting}>{isDeleting ? 'Menghapus...' : 'Konfirmasi Hapus'}</button></div>
        </div>
      </Modal>
      
      <Modal title="Konfirmasi Hapus Akun" isOpen={isDeleteAccountModalOpen} onClose={handleCloseAllModals}>
          <div className="confirm-delete-modal">
              <p><strong>PERINGATAN TERAKHIR:</strong> Anda akan menghapus akun Anda secara permanen, termasuk semua data stok, supplier, dan riwayat. Aksi ini sama sekali tidak dapat diurungkan.</p>
              <p>Masukkan password Anda untuk melanjutkan.</p>
              <div className="form-group-pengaturan"><label htmlFor="passwordForDeleteAccount">Password Anda</label><input type="password" id="passwordForDeleteAccount" placeholder="Masukkan password Anda" value={passwordForDelete} onChange={(e) => setPasswordForDelete(e.target.value)} className="form-input-modal" /></div>
              <div className="modal-actions"><button onClick={handleCloseAllModals} className="button-cancel">Batal</button><button onClick={handleConfirmDeleteAccount} className="button-danger" disabled={isDeleting}>{isDeleting ? 'Ya, Hapus Akun Saya' : 'Hapus Akun Saya'}</button></div>
          </div>
      </Modal>

    </div>
  );
}

export default PengaturanPage;