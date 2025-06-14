import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getLaporanPenjualan } from './penjualanService';
import { showErrorToast } from '../utils/toastHelper';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import '../styles/DashboardPages.css';
import './RiwayatPenjualanPage.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const ITEMS_PER_PAGE = 10;
const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
const formatDate = (timestamp) => new Date(timestamp).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const formatShortDate = (timestamp) => new Date(timestamp).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });

function RiwayatPenjualanPage() {
    const { user } = useAuth();
    const [laporan, setLaporan] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState(() => {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 29);
        return {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
        };
    });

    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleGenerateLaporan = useCallback(async () => {
        if (!filters.startDate || !filters.endDate) {
            showErrorToast("Silakan pilih rentang tanggal.");
            return;
        }
        setIsLoading(true);
        try {
            const response = await getLaporanPenjualan(filters);
            setLaporan(response.data.data);
            setCurrentPage(1);
        } catch (error) {
            showErrorToast(error.response?.data?.message || "Gagal membuat laporan.");
            setLaporan(null);
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        handleGenerateLaporan();
    }, []);

    const paginatedTransactions = useMemo(() => {
        if (!laporan) return [];
        const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
        const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
        return laporan.riwayatTransaksi.slice(indexOfFirstItem, indexOfLastItem);
    }, [laporan, currentPage]);

    const totalPages = laporan ? Math.ceil(laporan.riwayatTransaksi.length / ITEMS_PER_PAGE) : 0;
    
    const trendChartData = useMemo(() => {
        const dailySales = {};
        laporan?.riwayatTransaksi.forEach(tx => {
            const date = new Date(tx.tanggal).toISOString().split('T')[0];
            if (!dailySales[date]) {
                dailySales[date] = 0;
            }
            dailySales[date] += tx.totalPenjualan;
        });
        const labels = Object.keys(dailySales).sort();
        const data = labels.map(label => dailySales[label]);
        return {
            labels: labels.map(l => formatShortDate(l)),
            datasets: [{
                label: 'Total Penjualan',
                data,
                borderColor: '#16a34a',
                backgroundColor: 'rgba(22, 163, 74, 0.1)',
                fill: true,
                tension: 0.4,
            }],
        };
    }, [laporan]);

    const barChartData = {
        labels: laporan?.produkTerlaris.map(p => p.namaProduk) || [],
        datasets: [{
            label: 'Jumlah Terjual',
            data: laporan?.produkTerlaris.map(p => p.terjual) || [],
            backgroundColor: '#22c55e',
            borderRadius: 4,
        }],
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Riwayat & Analisis Penjualan</h2>
            </div>

            <div className="filters-container">
                <div className="filter-group">
                    <label htmlFor="startDate">Tanggal Mulai</label>
                    <input type="date" name="startDate" id="startDate" value={filters.startDate} onChange={handleFilterChange} />
                </div>
                <div className="filter-group">
                    <label htmlFor="endDate">Tanggal Selesai</label>
                    <input type="date" name="endDate" id="endDate" value={filters.endDate} onChange={handleFilterChange} />
                </div>
                <button onClick={handleGenerateLaporan} className="button-add" disabled={isLoading}>{isLoading ? 'Memuat...' : 'Terapkan Filter'}</button>
            </div>
            
            {isLoading ? <p>Memuat laporan...</p> : laporan && (
                <div className="laporan-content">
                    <div className="kpi-cards-container">
                        <div className="kpi-card"><h3>Total Penjualan</h3><p>{formatRupiah(laporan.kpi.totalPenjualan)}</p></div>
                        <div className="kpi-card safe"><h3>Total Laba</h3><p>{formatRupiah(laporan.kpi.totalLaba)}</p></div>
                        <div className="kpi-card"><h3>Jumlah Transaksi</h3><p>{laporan.kpi.jumlahTransaksi}</p></div>
                        <div className="kpi-card"><h3>Rata-rata / Transaksi</h3><p>{formatRupiah(laporan.kpi.rataRataTransaksi)}</p></div>
                    </div>

                    <div className="dashboard-grid">
                        <div className="dashboard-widget large-widget">
                            <h3 className="widget-title">Tren Penjualan</h3>
                            <div className="chart-wrapper-laporan"><Line data={trendChartData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
                        </div>
                        <div className="dashboard-widget full-width">
                            <h3 className="widget-title">Produk Terlaris</h3>
                            <div className="chart-wrapper-laporan"><Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
                        </div>
                    </div>
                    
                    <div className="table-container">
                        <h3 className="table-title">Detail Semua Transaksi</h3>
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead><tr><th>Tanggal</th><th>Item Terjual</th><th>Total Penjualan</th><th>Total Modal</th><th>Laba</th></tr></thead>
                                <tbody>
                                    {paginatedTransactions.length > 0 ? paginatedTransactions.map(tx => (
                                        <tr key={tx.id}>
                                            <td>{formatDate(tx.tanggal)}</td>
                                            <td className="items-cell">{tx.items.map(it => `${it.namaProduk} (x${it.qty})`).join(', ')}</td>
                                            <td>{formatRupiah(tx.totalPenjualan)}</td>
                                            <td>{formatRupiah(tx.totalModal)}</td>
                                            <td className="laba-positive">{formatRupiah(tx.laba)}</td>
                                        </tr>
                                    )) : <tr><td colSpan="5" style={{textAlign:'center'}}>Tidak ada transaksi pada periode ini.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                        {totalPages > 1 && (
                            <div className="pagination-controls">
                                <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>‹ Sebelumnya</button>
                                <span>Halaman {currentPage} dari {totalPages}</span>
                                <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>› Berikutnya</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default RiwayatPenjualanPage;