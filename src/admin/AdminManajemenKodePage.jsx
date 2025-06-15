import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createRedeemCode, getAllRedeemCodes, updateRedeemCode, deleteRedeemCode } from './adminService';
import { showSuccessToast, showErrorToast } from '../utils/toastHelper';
import Modal from '../components/Modal';
import '../styles/DashboardPages.css';
import './AdminManajemenKodePage.css';

const ITEMS_PER_PAGE = 10;
const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
const formatDate = (timestamp) => new Date(timestamp).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

function RedeemCodeForm({ onSuccess, onClose, initialData = null }) {
    const [formData, setFormData] = useState({ value: '', limit: '', isActive: true });
    const isEditMode = initialData !== null;

    useEffect(() => {
        if (isEditMode && initialData) {
            setFormData({
                value: initialData.value,
                limit: initialData.limit,
                isActive: initialData.isActive,
            });
        }
    }, [initialData, isEditMode]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await updateRedeemCode(initialData.code, formData);
                showSuccessToast("Kode berhasil diperbarui!");
            } else {
                await createRedeemCode(formData);
                showSuccessToast("Kode baru berhasil dibuat!");
            }
            onSuccess();
        } catch (error) {
            showErrorToast(error.response?.data?.message || "Gagal menyimpan kode.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="redeem-code-form">
            <div className="form-group">
                <label htmlFor="value">Nilai Saldo (Rp)</label>
                <input type="number" id="value" name="value" value={formData.value} onChange={handleChange} required disabled={isEditMode} />
            </div>
            <div className="form-group">
                <label htmlFor="limit">Batas Jumlah Redeem</label>
                <input type="number" id="limit" name="limit" value={formData.limit} onChange={handleChange} required />
            </div>
            {isEditMode && (
                <div className="form-group-checkbox">
                    <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange} />
                    <label htmlFor="isActive">Aktifkan Kode</label>
                </div>
            )}
            <div className="form-actions">
                <button type="button" className="button-cancel" onClick={onClose}>Batal</button>
                <button type="submit" className="button-add">Simpan</button>
            </div>
        </form>
    );
}

function AdminManajemenKodePage() {
    const [codes, setCodes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCode, setEditingCode] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchCodes = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getAllRedeemCodes();
            setCodes(response.data.data || []);
        } catch (error) {
            showErrorToast("Gagal memuat kode redeem.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCodes();
    }, [fetchCodes]);

    const { currentItems, totalPages } = useMemo(() => {
        const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
        const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
        return {
            currentItems: codes.slice(indexOfFirstItem, indexOfLastItem),
            totalPages: Math.ceil(codes.length / ITEMS_PER_PAGE),
        };
    }, [codes, currentPage]);

    const handleOpenModal = (code = null) => {
        setEditingCode(code);
        setIsModalOpen(true);
    };

    const handleFormSuccess = () => {
        fetchCodes();
        setIsModalOpen(false);
    };

    const handleDeleteCode = async (codeId) => {
        if(window.confirm(`Yakin ingin menghapus kode ${codeId}?`)) {
            try {
                await deleteRedeemCode(codeId);
                showSuccessToast("Kode berhasil dihapus.");
                fetchCodes();
            } catch (error) {
                showErrorToast(error.response?.data?.message || "Gagal menghapus kode.");
            }
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Manajemen Kode Redeem</h2>
                <button className="button-add" onClick={() => handleOpenModal()}>+ Buat Kode Baru</button>
            </div>
            <div className="table-container">
                <div className="table-responsive">
                    <table className="data-table">
                        <thead><tr><th>Kode</th><th>Nilai Saldo</th><th>Penggunaan</th><th>Dibuat Pada</th><th>Status</th><th>Aksi</th></tr></thead>
                        <tbody>
                            {isLoading ? (<tr><td colSpan="6">Memuat...</td></tr>) : currentItems.map(code => (
                                <tr key={code.code}>
                                    <td className="code-text">{code.code}</td>
                                    <td>{formatRupiah(code.value)}</td>
                                    <td>{code.redeemCount} / {code.limit}</td>
                                    <td>{formatDate(code.createdAt)}</td>
                                    <td><span className={`status-badge ${code.isActive ? 'status-aman' : 'status-restock'}`}>{code.isActive ? 'Aktif' : 'Tidak Aktif'}</span></td>
                                    <td className="action-buttons">
                                        <button className="button-edit" onClick={() => handleOpenModal(code)}>Edit</button>
                                        <button className="button-delete" onClick={() => handleDeleteCode(code.code)}>Hapus</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {totalPages > 1 && (
                    <div className="pagination-controls">
                        <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>‹</button>
                        <span>Halaman {currentPage} dari {totalPages}</span>
                        <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>›</button>
                    </div>
                )}
            </div>
            <Modal title={editingCode ? "Edit Kode Redeem" : "Buat Kode Redeem Baru"} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <RedeemCodeForm onSuccess={handleFormSuccess} onClose={() => setIsModalOpen(false)} initialData={editingCode} />
            </Modal>
        </div>
    );
}
export default AdminManajemenKodePage;