import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getHistory } from './historyService';
import { getAllStok } from '../stok/stokService';
import { showErrorToast } from '../utils/toastHelper';
import '../styles/DashboardPages.css';

const ITEMS_PER_PAGE = 15;

function StockHistoryPage() {
  const [history, setHistory] = useState([]);
  const [stokItems, setStokItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [filters, setFilters] = useState({
    itemId: '',
    startDate: '',
    endDate: '',
  });

  const fetchStokItems = useCallback(async () => {
    try {
      const response = await getAllStok();
      setStokItems(response.data.data || []);
    } catch (err) {
      showErrorToast('Gagal memuat daftar item stok.');
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getHistory(filters);
      setHistory(response.data.data || []);
    } catch (err) {
      const fetchError = err.response?.data?.message || 'Gagal memuat riwayat stok.';
      setError(fetchError);
      showErrorToast(fetchError);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchStokItems();
    fetchHistory();
  }, [fetchStokItems, fetchHistory]);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };
  
  const paginatedHistory = useMemo(() => {
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    return history.slice(indexOfFirstItem, indexOfLastItem);
  }, [history, currentPage]);

  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };
  
  const formatDate = (isoString) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Riwayat Stok</h2>
      </div>

      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="itemId">Filter Berdasarkan Barang</label>
          <select name="itemId" id="itemId" value={filters.itemId} onChange={handleFilterChange}>
            <option value="">-- Semua Barang --</option>
            {stokItems.map(item => (
              <option key={item.id} value={item.id}>{item.namaBarang}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="startDate">Tanggal Mulai</label>
          <input type="date" name="startDate" id="startDate" value={filters.startDate} onChange={handleFilterChange} />
        </div>
        <div className="filter-group">
          <label htmlFor="endDate">Tanggal Selesai</label>
          <input type="date" name="endDate" id="endDate" value={filters.endDate} onChange={handleFilterChange} />
        </div>
      </div>

      <div className="table-container">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Nama Barang</th>
                <th>Jenis Perubahan</th>
                <th>Jumlah</th>
                <th>Stok Akhir</th>
                <th>Harga Modal/Unit</th>
                <th>Total Nilai</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="8" style={{ textAlign: 'center' }}>Memuat riwayat...</td></tr>
              ) : paginatedHistory.length > 0 ? (
                paginatedHistory.map(item => {
                  const isPositive = item.jumlahPerubahan > 0;
                  return (
                    <tr key={item.id}>
                      <td>{formatDate(item.timestamp)}</td>
                      <td>{item.namaBarang}</td>
                      <td><span className={`change-type-badge type-${item.jenisPerubahan}`}>{item.jenisPerubahan.replace(/_/g, ' ')}</span></td>
                      <td className={isPositive ? 'change-positive' : 'change-negative'}>
                        {isPositive ? `+${item.jumlahPerubahan}` : item.jumlahPerubahan}
                      </td>
                      <td>{item.jumlahSesudah}</td>
                      <td>{formatRupiah(item.hargaBeliSatuan || 0)}</td>
                      <td>{formatRupiah(item.nilaiPerubahan || 0)}</td>
                      <td>{item.keterangan || '-'}</td>
                    </tr>
                  )
                })
              ) : (
                <tr><td colSpan="8" style={{ textAlign: 'center' }}>{filters.itemId ? 'Tidak ada riwayat untuk barang ini.' : 'Pilih barang untuk melihat riwayatnya.'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {!isLoading && history.length > 0 && totalPages > 1 && (
            <div className="pagination-controls">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage <= 1}>Sebelumnya</button>
            <span>Halaman {currentPage} dari {totalPages}</span>
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage >= totalPages}>Berikutnya</button>
            </div>
        )}
      </div>
    </div>
  );
}

export default StockHistoryPage;