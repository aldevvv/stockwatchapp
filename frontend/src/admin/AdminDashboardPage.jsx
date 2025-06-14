import React, { useState, useEffect, useCallback } from 'react';
import { getPlatformStats } from './adminService';
import '../styles/DashboardPages.css';
import './AdminDashboardPage.css';

const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
const formatAngka = (angka) => new Intl.NumberFormat('id-ID').format(angka || 0);

function AdminDashboardPage() {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getPlatformStats();
            setStats(response.data);
        } catch (error) {
            console.error("Gagal mengambil statistik:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (isLoading) {
        return <div className="page-container"><p>Memuat statistik platform...</p></div>
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Dashboard Admin</h2>
            </div>
            {stats ? (
                <div className="admin-kpi-grid">
                    <div className="admin-kpi-card color-1"><h3>Total Pengguna</h3><p>{formatAngka(stats.totalUsers)}</p></div>
                    <div className="admin-kpi-card color-2"><h3>Total Penjualan</h3><p>{formatRupiah(stats.totalPenjualan)}</p></div>
                    <div className="admin-kpi-card color-3"><h3>Total Saldo Pengguna</h3><p>{formatRupiah(stats.totalSaldo)}</p></div>
                    <div className="admin-kpi-card color-4"><h3>Total Item Stok</h3><p>{formatAngka(stats.totalStokItems)}</p></div>
                    <div className="admin-kpi-card color-5"><h3>Total Produk Jual</h3><p>{formatAngka(stats.totalProdukJadi)}</p></div>
                    <div className="admin-kpi-card color-6"><h3>Total Supplier</h3><p>{formatAngka(stats.totalSuppliers)}</p></div>
                    <div className="admin-kpi-card color-7"><h3>Total Listing</h3><p>{formatAngka(stats.totalListings)}</p></div>
                    <div className="admin-kpi-card color-8"><h3>Kode Redeem Dibuat</h3><p>{formatAngka(stats.totalRedeemCodes)}</p></div>
                    <div className="admin-kpi-card color-9"><h3>Kode Redeem Digunakan</h3><p>{formatAngka(stats.usedRedeemCodes)}</p></div>
                </div>
            ) : <p>Gagal memuat statistik.</p>}
        </div>
    );
}
export default AdminDashboardPage;