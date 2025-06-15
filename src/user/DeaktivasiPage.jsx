import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { deactivateAccount } from './userService';
import { showSuccessToast, showErrorToast } from '../utils/toastHelper';
import Modal from '../components/Modal';
import '../styles/DashboardPages.css';
import './PengaturanPages.css';

function DeaktivasiPage() {
    const { logout } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [isDeactivating, setIsDeactivating] = useState(false);

    const handleDeactivate = async () => {
        if (!password) {
            showErrorToast('Password dibutuhkan untuk konfirmasi.');
            return;
        }
        setIsDeactivating(true);
        try {
            const response = await deactivateAccount(password);
            showSuccessToast(response.data.message + " Anda akan otomatis logout.");
            setTimeout(() => {
                logout();
            }, 3000);
        } catch (err) {
            showErrorToast(err.response?.data?.message || 'Gagal menonaktifkan akun.');
        } finally {
            setIsDeactivating(false);
            setIsModalOpen(false);
        }
    };

    return (
        <>
            <div className="pengaturan-card danger-zone-card">
                <div className="pengaturan-card-header"><h3>Deaktivasi Akun</h3></div>
                <div className="pengaturan-card-body">
                    <h4>Nonaktifkan Akun Anda Sementara</h4>
                    <p>
                        Dengan menonaktifkan akun, Anda tidak akan bisa login atau menerima notifikasi apapun. 
                        Data stok dan riwayat Anda akan tetap kami simpan dengan aman. 
                        Anda bisa mengaktifkan kembali akun Anda kapan saja dengan menghubungi tim support kami.
                    </p>
                    <div className="pengaturan-card-footer" style={{ borderTop: 'none', padding: 0 }}>
                        <button className="button-danger" onClick={() => setIsModalOpen(true)}>Deaktivasi Akun Saya</button>
                    </div>
                </div>
            </div>
            <Modal title="Konfirmasi Deaktivasi Akun" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="confirm-delete-modal">
                    <p><strong>PERINGATAN:</strong> Apakah Anda yakin ingin menonaktifkan akun Anda?</p>
                    <p>Masukkan password Anda untuk melanjutkan.</p>
                    <div className="form-group">
                        <label htmlFor="password-deactivate">Password Anda</label>
                        <input id="password-deactivate" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="modal-actions">
                        <button onClick={() => setIsModalOpen(false)} className="button-cancel">Batal</button>
                        <button onClick={handleDeactivate} className="button-danger" disabled={isDeactivating}>
                            {isDeactivating ? 'Memproses...' : 'Ya, Nonaktifkan'}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
export default DeaktivasiPage;