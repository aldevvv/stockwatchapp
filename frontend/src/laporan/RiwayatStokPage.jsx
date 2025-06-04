import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getAllStok } from '../stok/stokService';
import { getRiwayatStokByItem } from './laporanService';
import { CSVLink } from 'react-csv';
import { showInfoToast, showErrorToast, showSuccessToast } from '../utils/toastHelper';
import RiwayatStokLineChart from './RiwayatStokLineChart';
import './RiwayatStokPage.css';

const ITEM_PER_HALAMAN = 5;

function RiwayatStokPage() {
  const [daftarStok, setDaftarStok] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedItemName, setSelectedItemName] = useState('');
  const [riwayatStokDisplay, setRiwayatStokDisplay] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);
  const [loadingStok, setLoadingStok] = useState(false);
  const [loadingRiwayat, setLoadingRiwayat] = useState(false);
  const [error, setError] = useState('');

  const [tanggalMulai, setTanggalMulai] = useState('');
  const [tanggalSelesai, setTanggalSelesai] = useState('');

  const [halamanSaatIni, setHalamanSaatIni] = useState(1);
  const [totalHalaman, setTotalHalaman] = useState(0);
  const [totalItemRiwayat, setTotalItemRiwayat] = useState(0);

  const [dataUntukEkspor, setDataUntukEkspor] = useState([]);
  const [isPreparingExport, setIsPreparingExport] = useState(false);
  const csvLinkRef = useRef(null);

  useEffect(() => {
    const fetchDaftarStok = async () => {
      setLoadingStok(true);
      try {
        const response = await getAllStok();
        setDaftarStok(response.data.data || []);
      } catch (err) {
        console.error("Gagal mengambil daftar stok:", err);
        setError('Gagal mengambil daftar stok.');
      } finally {
        setLoadingStok(false);
      }
    };
    fetchDaftarStok();
  }, []);

  const fetchRiwayatData = useCallback(async (page = 1, forDisplay = true) => {
    if (!selectedItemId) {
      if (forDisplay) {
        setRiwayatStokDisplay([]);
        setTotalHalaman(0);
        setTotalItemRiwayat(0);
        setHalamanSaatIni(1);
        setChartDataPoints([]);
      }
      return null;
    }

    if (forDisplay) setLoadingRiwayat(true);
    setError('');

    try {
      const limit = forDisplay ? ITEM_PER_HALAMAN : (totalItemRiwayat > 0 ? totalItemRiwayat : 10000); // Ambil semua untuk chart/export
      const response = await getRiwayatStokByItem(selectedItemId, tanggalMulai, tanggalSelesai, page, limit);
      
      const fetchedData = response.data.data || [];

      if (forDisplay) {
        setRiwayatStokDisplay(fetchedData);
        setHalamanSaatIni(response.data.pagination.halamanSaatIni);
        setTotalHalaman(response.data.pagination.totalHalaman);
        setTotalItemRiwayat(response.data.pagination.totalItem);
      }
      return fetchedData; // Kembalikan data untuk chart/export
    } catch (err) {
      console.error(`Gagal mengambil riwayat untuk item ${selectedItemId}:`, err);
      setError(`Gagal mengambil riwayat data.`);
      if (forDisplay) {
        setRiwayatStokDisplay([]);
        setTotalHalaman(0);
        setTotalItemRiwayat(0);
      }
      setChartDataPoints([]);
      return null;
    } finally {
      if (forDisplay) setLoadingRiwayat(false);
    }
  }, [selectedItemId, tanggalMulai, tanggalSelesai, totalItemRiwayat]); // Tambahkan totalItemRiwayat sbg dependensi untuk export

  useEffect(() => {
    const loadInitialData = async () => {
      if (selectedItemId) {
        setHalamanSaatIni(1);
        const displayData = await fetchRiwayatData(1, true); // Untuk tabel
        if (displayData) { // Hanya fetch data chart jika display data berhasil & ada
            const allDataForChart = await fetchRiwayatData(1, false); // Ambil semua data untuk chart
            setChartDataPoints(allDataForChart || []);
        }
      } else {
        setRiwayatStokDisplay([]);
        setTotalHalaman(0);
        setTotalItemRiwayat(0);
        setChartDataPoints([]);
      }
    };
    loadInitialData();
  }, [selectedItemId, fetchRiwayatData]);

  const handleItemSelectChange = (e) => {
    const itemId = e.target.value;
    setSelectedItemId(itemId);
    const selectedItem = daftarStok.find(item => item.id === itemId);
    setSelectedItemName(selectedItem ? selectedItem.namaBarang : '');
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    if (!selectedItemId) {
      showInfoToast('Silakan pilih barang terlebih dahulu sebelum menerapkan filter.');
      return;
    }
    setHalamanSaatIni(1); 
    // fetchRiwayatData untuk display akan dipicu oleh useEffect [selectedItemId, fetchRiwayatData]
    // karena fetchRiwayatData (useCallback) akan mendapatkan definisi baru jika tanggal berubah
    // dan kita juga perlu memuat ulang data chart
     const loadFilteredData = async () => {
        const displayData = await fetchRiwayatData(1, true);
        if (displayData) {
            const allDataForChart = await fetchRiwayatData(1, false);
            setChartDataPoints(allDataForChart || []);
        }
    };
    loadFilteredData();
  };

  const gantiHalaman = (nomorHalaman) => {
    if (nomorHalaman >= 1 && nomorHalaman <= totalHalaman) {
      fetchRiwayatData(nomorHalaman, true);
    }
  };
  
  const formatJenisPerubahan = (jenis) => {
    switch (jenis) {
      case 'STOK_AWAL': return 'Jumlah Awal Stok';
      case 'PENAMBAHAN_MANUAL': return 'Menambah Jumlah Stok';
      case 'PENGURANGAN_MANUAL': return 'Mengurangi Jumlah Stok';
      case 'HAPUS_BARANG': return 'Barang Dihapus';
      default: return jenis.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
  };

  const csvHeaders = [
    { label: "Tanggal & Waktu", key: "timestampFormatted" },
    { label: "Jenis Perubahan", key: "jenisPerubahanFormatted" },
    { label: "Nama Barang", key: "namaBarang" },
    { label: "Jumlah Sebelum", key: "jumlahSebelum" },
    { label: "Perubahan", key: "jumlahPerubahan" },
    { label: "Jumlah Sesudah", key: "jumlahSesudah" },
    { label: "Keterangan", key: "keterangan" }
  ];

  const handleExportCsv = async () => {
    if (!selectedItemId) {
      showInfoToast("Pilih barang terlebih dahulu untuk diekspor.");
      return;
    }
    if (totalItemRiwayat === 0) {
        showInfoToast("Tidak ada data riwayat untuk diekspor.");
        return;
    }
    setIsPreparingExport(true);
    setError('');
    try {
      const allFilteredData = await fetchRiwayatData(1, false);
      
      if (!allFilteredData || allFilteredData.length === 0) {
        showInfoToast("Tidak ada data riwayat untuk diekspor berdasarkan filter saat ini.");
        setIsPreparingExport(false);
        return;
      }

      const formattedForCsv = allFilteredData.map(log => ({
        timestampFormatted: new Date(log.timestamp).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
        jenisPerubahanFormatted: formatJenisPerubahan(log.jenisPerubahan),
        namaBarang: log.namaBarang,
        jumlahSebelum: log.jumlahSebelum,
        jumlahPerubahan: log.jumlahPerubahan,
        jumlahSesudah: log.jumlahSesudah,
        keterangan: log.keterangan || ''
      }));
      setDataUntukEkspor(formattedForCsv);
      
      setTimeout(() => { 
        if (csvLinkRef.current) {
            csvLinkRef.current.link.click();
            showSuccessToast("Data CSV berhasil diunduh!");
        }
      }, 100);

    } catch (err) {
      console.error("Gagal menyiapkan data ekspor:", err);
      showErrorToast("Gagal menyiapkan data untuk ekspor.");
    } finally {
      setIsPreparingExport(false);
    }
  };

  return (
    <div className="riwayat-stok-page">
      <div className="page-header">
        <h1>Riwayat Stok Barang</h1>
      </div>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleFilterSubmit} className="filter-form">
        <div className="filter-group">
          <label htmlFor="item-select">Pilih Barang:</label>
          {loadingStok ? (
            <p>Memuat...</p>
          ) : (
            <select id="item-select" value={selectedItemId} onChange={handleItemSelectChange}>
              <option value="">-- Pilih Item Stok --</option>
              {daftarStok.map(item => (
                <option key={item.id} value={item.id}>
                  {item.namaBarang}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="filter-group">
          <label htmlFor="tanggalMulai">Tanggal Mulai:</label>
          <input 
            type="date" 
            id="tanggalMulai" 
            value={tanggalMulai} 
            onChange={(e) => setTanggalMulai(e.target.value)} 
          />
        </div>

        <div className="filter-group">
          <label htmlFor="tanggalSelesai">Tanggal Selesai:</label>
          <input 
            type="date" 
            id="tanggalSelesai" 
            value={tanggalSelesai} 
            onChange={(e) => setTanggalSelesai(e.target.value)} 
          />
        </div>
        
        <button type="submit" className="button-filter" disabled={loadingRiwayat || !selectedItemId}>
          {loadingRiwayat && halamanSaatIni === 1 ? 'Memuat...' : 'Terapkan Filter'}
        </button>
      </form>

      {selectedItemId && !loadingStok && (
        <div className="laporan-actions">
          <button onClick={handleExportCsv} className="button-export" disabled={isPreparingExport || totalItemRiwayat === 0 }>
            {isPreparingExport ? 'Menyiapkan...' : 'Ekspor Semua ke CSV'}
          </button>
          {totalItemRiwayat > 0 && !loadingRiwayat &&
            <span className="total-data-info">
                Menampilkan {riwayatStokDisplay.length} data di halaman ini (Total {totalItemRiwayat} data)
            </span>
          }
        </div>
      )}
      
      <CSVLink
        data={dataUntukEkspor}
        headers={csvHeaders}
        filename={`RiwayatStok_${selectedItemName.replace(/\s+/g, '_') || selectedItemId}_${tanggalMulai || 'awal'}_sd_${tanggalSelesai || 'akhir'}.csv`}
        className="hidden-csv-link"
        target="_blank"
        ref={csvLinkRef}
      />
      
      {!loadingRiwayat && selectedItemId && chartDataPoints && chartDataPoints.length > 0 && (
        <RiwayatStokLineChart chartDataPoints={chartDataPoints} itemName={selectedItemName} />
      )}

      {loadingRiwayat ? (
        <p>Memuat riwayat stok...</p>
      ) : riwayatStokDisplay.length > 0 ? (
        <>
          <table className="riwayat-table">
            <thead>
              <tr>
                <th>Tanggal & Waktu</th>
                <th>Jenis Perubahan</th>
                <th>Nama Barang</th>
                <th>Jml. Sebelum</th>
                <th>Perubahan</th>
                <th>Jml. Sesudah</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {riwayatStokDisplay.map((log) => (
                <tr key={log.id}>
                  <td>{new Date(log.timestamp).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                  <td>{formatJenisPerubahan(log.jenisPerubahan)}</td>
                  <td>{log.namaBarang}</td>
                  <td>{log.jumlahSebelum}</td>
                  <td className={log.jumlahPerubahan >= 0 ? 'jumlah-positif' : 'jumlah-negatif'}>
                    {log.jumlahPerubahan > 0 ? `+${log.jumlahPerubahan}` : log.jumlahPerubahan}
                  </td>
                  <td>{log.jumlahSesudah}</td>
                  <td>{log.keterangan || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalHalaman > 1 && (
            <div className="pagination-controls">
              <button 
                onClick={() => gantiHalaman(halamanSaatIni - 1)} 
                disabled={halamanSaatIni <= 1 || loadingRiwayat}
              >
                Sebelumnya
              </button>
              <span>
                Halaman {halamanSaatIni} dari {totalHalaman}
              </span>
              <button 
                onClick={() => gantiHalaman(halamanSaatIni + 1)} 
                disabled={halamanSaatIni >= totalHalaman || loadingRiwayat}
              >
                Berikutnya
              </button>
            </div>
          )}
        </>
      ) : (
        selectedItemId && !loadingRiwayat && <p>Tidak ada data riwayat untuk barang dan filter yang dipilih.</p>
      )}
    </div>
  );
}

export default RiwayatStokPage;