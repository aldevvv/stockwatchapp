import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllStok } from '../stok/stokService';
import { getAllSuppliers } from '../supplier/supplierService';
import { getHistory } from '../history/historyService';
import ItemValueChart from './ItemValueChart';
import './StockDashboardPage.css';

function StockDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalNilaiInventaris: 0,
    itemStokKritis: 0,
    itemStokAman: 0,
    totalItemStok: 0,
    jumlahSupplier: 0,
    rataRataNilaiPerItem: 0,
  });
  const [criticalItems, setCriticalItems] = useState([]);
  const [recentHistory, setRecentHistory] = useState([]);
  const [topValueItems, setTopValueItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  const formatDate = (isoString) => new Date(isoString).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [stokRes, supplierRes, historyRes] = await Promise.all([
        getAllStok(),
        getAllSuppliers(),
        getHistory({ limit: 5 })
      ]);

      const stokItems = stokRes.data.data || [];
      const supplierItems = supplierRes.data.data || [];
      const historyItems = historyRes.data.data || [];

      let totalNilai = 0;
      const stokItemsWithTotalValue = stokItems.map(item => {
        const itemValue = Number(item.jumlah) * Number(item.hargaBeliTerakhir || item.hargaBeliAwal || 0);
        totalNilai += itemValue;
        return { ...item, totalValue: itemValue };
      });
      
      stokItemsWithTotalValue.sort((a, b) => b.totalValue - a.totalValue);
      setTopValueItems(stokItemsWithTotalValue.slice(0, 5));

      const stokKritis = stokItems.filter(item => Number(item.jumlah) <= Number(item.batasMinimum));
      const totalItems = stokItems.length;
      const rataRataNilai = totalItems > 0 ? totalNilai / totalItems : 0;

      setStats({
        totalNilaiInventaris: totalNilai,
        itemStokKritis: stokKritis.length,
        itemStokAman: totalItems - stokKritis.length,
        jumlahSupplier: supplierItems.length,
        totalItemStok: totalItems,
        rataRataNilaiPerItem: rataRataNilai,
      });

      setCriticalItems(stokKritis.slice(0, 5));
      setRecentHistory(historyItems.slice(0, 5));

    } catch (error) {
      console.error("Gagal memuat data dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);
  
  if (isLoading) {
    return <div className="dashboard-loading">Memuat Dashboard...</div>;
  }

  return (
    <div className="stock-dashboard-page sidebar-is-open">
      <div className="page-header">
        <h2>Dashboard Ringkasan</h2>
        <p>Halo {user?.namaLengkap || 'Pengguna'}, Selamat Datang Kembali!</p>
      </div>
      
      <div className="kpi-cards-container">
          <div className="kpi-card">
            <h3>Estimasi Nilai Inventaris</h3>
            <p>{formatRupiah(stats.totalNilaiInventaris)}</p>
          </div>
          <div className="kpi-card critical">
            <h3>Total Stok (Perlu Restock)</h3>
            <p>{stats.itemStokKritis}</p>
          </div>
          <div className="kpi-card">
            <h3>Total Stok (Aman)</h3>
            <p>{stats.itemStokAman}</p>
          </div>
           <div className="kpi-card">
            <h3>Total Varian Stok</h3>
            <p>{stats.totalItemStok}</p>
          </div>
          <div className="kpi-card">
            <h3>Jumlah Supplier</h3>
            <p>{stats.jumlahSupplier}</p>
          </div>
          <div className="kpi-card">
            <h3>Rata-rata Nilai/Item</h3>
            <p>{formatRupiah(stats.rataRataNilaiPerItem)}</p>
          </div>
        </div>

        <div className="dashboard-grid">
            <div className="dashboard-widget">
                <h3 className="widget-title">Aksi Cepat</h3>
                <div className="quick-actions">
                    <Link to="/stock-list" className="action-button">Tambah Stok</Link>
                    <Link to="/supplier-list" className="action-button">Tambah Supplier</Link>
                    <Link to="/stock-history" className="action-button">Lihat Riwayat Stok</Link>
                </div>
            </div>
            <div className="dashboard-widget">
                <h3 className="widget-title">Nama Barang (Perlu Restock)</h3>
                <ul className="widget-list">
                    {criticalItems.length > 0 ? criticalItems.map(item => (
                        <li key={item.id}><span>{item.namaBarang}</span><span className="list-value-bad">{item.jumlah} {item.satuan}</span></li>
                    )) : <li>Semua stok dalam kondisi aman.</li>}
                </ul>
            </div>
            <div className="dashboard-widget large-widget">
                <h3 className="widget-title">5 Item Stok dengan Nilai Tertinggi</h3>
                <ItemValueChart chartData={topValueItems} />
            </div>
             <div className="dashboard-widget full-width">
                <h3 className="widget-title">Aktivitas Terakhir</h3>
                <div className="table-responsive">
                    <table className="widget-table">
                        <tbody>
                            {recentHistory.length > 0 ? recentHistory.map(item => (
                                <tr key={item.id}>
                                    <td>{formatDate(item.timestamp)}</td>
                                    <td>{item.namaBarang}</td>
                                    <td><span className={`change-type-badge type-${item.jenisPerubahan}`}>{item.jenisPerubahan.replace(/_/g, ' ')}</span></td>
                                    <td className={item.jumlahPerubahan > 0 ? 'change-positive' : 'change-negative'}>
                                        {item.jumlahPerubahan > 0 ? `+${item.jumlahPerubahan}` : item.jumlahPerubahan}
                                    </td>
                                </tr>
                            )) : <tr><td><span style={{color: '#6b7280'}}>Belum ada aktivitas.</span></td></tr>}
                        </tbody>
                    </table>
                </div>
                <div className="widget-footer">
                    <Link to="/stock-history" className="view-all-link">Lihat Semua Riwayat →</Link>
                </div>
            </div>
        </div>
    </div>
  );
}

export default StockDashboardPage;