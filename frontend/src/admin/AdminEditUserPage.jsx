import React, { useState, useEffect, useCallback } from 'react';
import { getAllUsersProfiles, getUserDetailsForAdmin, manageUserAccount } from './adminService';
import { showErrorToast, showSuccessToast } from '../utils/toastHelper';
import '../styles/DashboardPages.css';
import './AdminEditUserPage.css';

function AdminEditUserPage() {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [userDetails, setUserDetails] = useState(null);
    const [formData, setFormData] = useState({ plan: '', sisaDurasi: '', saldo: '', catatan: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        getAllUsersProfiles().then(res => setUsers(res.data.data));
    }, []);

    const handleUserSelect = useCallback(async (userId) => {
        setSelectedUserId(userId);
        if (!userId) {
            setUserDetails(null);
            return;
        }
        setIsLoading(true);
        try {
            const response = await getUserDetailsForAdmin(userId);
            const profile = response.data.data.profile;
            setUserDetails(response.data.data);

            let sisaDurasi = '';
            if (profile.planExpiry) {
                const diff = profile.planExpiry - Date.now();
                sisaDurasi = diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
            }

            setFormData({
                plan: profile.plan || 'Free',
                sisaDurasi: sisaDurasi,
                saldo: profile.saldo || 0,
                catatan: ''
            });
        } catch (error) {
            showErrorToast("Gagal memuat detail pengguna.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleInputChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await manageUserAccount(selectedUserId, formData);
            showSuccessToast(response.data.message);
            handleUserSelect(selectedUserId); // Refresh data
        } catch (error) {
            showErrorToast(error.response?.data?.message || "Gagal memperbarui akun.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Edit Akun Pengguna</h2>
            </div>
            <div className="form-container-card">
                <div className="form-group">
                    <label htmlFor="user-select">Pilih Pengguna untuk Diedit</label>
                    <select id="user-select" value={selectedUserId} onChange={(e) => handleUserSelect(e.target.value)}>
                        <option value="">-- Pilih Pengguna --</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.namaLengkap} ({user.email})</option>
                        ))}
                    </select>
                </div>

                {isLoading ? <p>Memuat...</p> : userDetails && (
                    <form onSubmit={handleSubmit} className="edit-user-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="plan">Paket Langganan</label>
                                <select name="plan" id="plan" value={formData.plan} onChange={handleInputChange}>
                                    <option value="Free">Free</option>
                                    <option value="Basic">Basic</option>
                                    <option value="Pro">Pro</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="sisaDurasi">Sisa Durasi (hari)</label>
                                <input type="number" name="sisaDurasi" id="sisaDurasi" value={formData.sisaDurasi} onChange={handleInputChange} disabled={formData.plan === 'Free'} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="saldo">Saldo Akun (Rp)</label>
                            <input type="number" name="saldo" id="saldo" value={formData.saldo} onChange={handleInputChange} />
                        </div>
                         <div className="form-group">
                            <label htmlFor="catatan">Catatan Perubahan (Opsional)</label>
                            <input type="text" id="catatan" name="catatan" value={formData.catatan} onChange={handleInputChange} placeholder="Contoh : Koreksi TopUp" />
                        </div>
                        <button type="submit" className="button-add" disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
                    </form>
                )}
            </div>
        </div>
    );
}
export default AdminEditUserPage;
