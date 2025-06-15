import React, { useState, useEffect, useCallback } from 'react';
import { getAllUsersProfiles, addSaldoToUser } from './adminService';
import { showSuccessToast, showErrorToast } from '../utils/toastHelper';
import '../styles/DashboardPages.css';
import './AdminTambahSaldoPage.css';

function AdminTambahSaldoPage() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [jumlah, setJumlah] = useState('');
    const [catatan, setCatatan] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchUsers = useCallback(async () => {
        try {
            const response = await getAllUsersProfiles();
            setUsers(response.data.data.filter(u => u.role !== 'admin') || []);
        } catch (error) {
            showErrorToast("Gagal memuat daftar pengguna.");
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedUser || !jumlah) {
            showErrorToast("Pilih pengguna dan masukkan jumlah saldo.");
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await addSaldoToUser(selectedUser, jumlah, catatan);
            showSuccessToast(response.data.message);
            setSelectedUser('');
            setJumlah('');
            setCatatan('');
        } catch (error) {
            showErrorToast(error.response?.data?.message || "Gagal menambahkan saldo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Tambah Saldo Pengguna</h2>
            </div>
            <div className="form-container-card">
                <form onSubmit={handleSubmit} className="add-saldo-form">
                    <div className="form-group">
                        <label htmlFor="user-select">Pilih Pengguna</label>
                        <select id="user-select" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required>
                            <option value="">-- Pilih Pengguna --</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.namaLengkap} ({user.email})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="jumlah">Jumlah Saldo (Rp)</label>
                        <input type="number" id="jumlah" value={jumlah} onChange={(e) => setJumlah(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="catatan">Catatan (Opsional)</label>
                        <input type="text" id="catatan" value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder="Contoh: Hadiah kompetisi, Kompensasi, dll." />
                    </div>
                    <button type="submit" className="button-add" disabled={isSubmitting}>
                        {isSubmitting ? 'Memproses...' : 'Tambahkan Saldo'}
                    </button>
                </form>
            </div>
        </div>
    );
}
export default AdminTambahSaldoPage;