import React, { useState, useEffect, useCallback } from 'react';
import { getAllUsersProfiles, getUserDetailsForAdmin } from './adminService';
import UserDetailModal from './UserDetailModal';
import { showErrorToast } from '../utils/toastHelper';
import '../styles/DashboardPages.css';

function AdminManajemenPengguna() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedUserDetails, setSelectedUserDetails] = useState(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getAllUsersProfiles();
            setUsers(response.data.data || []);
        } catch (error) {
            console.error("Gagal mengambil data pengguna:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenDetailModal = async (userId) => {
        try {
            const response = await getUserDetailsForAdmin(userId);
            setSelectedUserDetails(response.data.data);
            setIsDetailModalOpen(true);
        } catch (error) {
            showErrorToast("Gagal mengambil detail pengguna.");
        }
    };
    
    return (
        <div className="page-container">
            <div className="page-header"><h2>Manajemen Pengguna</h2></div>
            <div className="table-container">
                <div className="table-responsive">
                    <table className="data-table">
                        <thead><tr><th>Nama Lengkap</th><th>Nama Toko</th><th>Email</th><th>No. WhatsApp</th><th>Paket</th><th>Aksi</th></tr></thead>
                        <tbody>
                            {isLoading ? (<tr><td colSpan="6">Memuat...</td></tr>) : users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.namaLengkap || '-'}</td>
                                    <td>{user.namaToko || '-'}</td>
                                    <td>{user.email}</td>
                                    <td>{user.nomorWhatsAppNotifikasi || '-'}</td>
                                    <td>{user.plan || 'Free'}</td>
                                    <td className="action-buttons">
                                        <button className="button-edit" onClick={() => handleOpenDetailModal(user.id)}>Detail</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <UserDetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} userDetails={selectedUserDetails} />
        </div>
    );
}
export default AdminManajemenPengguna;
