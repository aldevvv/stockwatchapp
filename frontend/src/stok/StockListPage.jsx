import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllStok, deleteStok as deleteStokService } from './stokService';
import { showSuccessToast, showErrorToast, showInfoToast } from '../utils/toastHelper';
import Modal from '../components/Modal';
import StokForm from './StokForm';
import ListStokForm from '../stockshare/ListStokForm';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../styles/DashboardPages.css';

const ITEM_PER_HALAMAN = 10;

function StockListPage() {
  const { user } = useAuth();
  const [stok, setStok] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingStok, setEditingStok] = useState(null);

  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [itemToSell, setItemToSell] = useState(null);

  const [halamanSaatIni, setHalamanSaatIni] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllStok();
      setStok(response.data.data || []);
    } catch (err) {
      const fetchError = err.response?.data?.message || 'Gagal memuat data stok.';
      setError(fetchError);
      showErrorToast(fetchError);
    } finally {
      setLoading(false);
    }
  }, []); 

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  useEffect(() => {
    setHalamanSaatIni(1);
  }, [stok.length]);

  const { currentStockItems, totalHalaman } = useMemo(() => {
    const indexOfLastItem = halamanSaatIni * ITEM_PER_HALAMAN;
    const indexOfFirstItem = indexOfLastItem - ITEM_PER_HALAMAN;
    const currentItems = stok.slice(indexOfFirstItem, indexOfLastItem);
    const pages = Math.ceil(stok.length / ITEM_PER_HALAMAN);
    return { currentStockItems: currentItems, totalHalaman: pages };
  }, [stok, halamanSaatIni]);

  const gantiHalaman = (nomorHalaman) => {
    setHalamanSaatIni(nomorHalaman);
  };

  const handleFormSuccess = () => {
    fetchData(); 
    closeFormModal();
  };

  const handleEdit = (item) => { 
    setEditingStok(item); 
    setIsFormModalOpen(true); 
  };
  
  const handleDelete = async (itemId, namaBarang) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus "${namaBarang}"?`)) {
      try {
        await deleteStokService(itemId);
        showSuccessToast('Barang berhasil dihapus!');
        fetchData();
      } catch (err) {
        showErrorToast(err.response?.data?.message || 'Gagal menghapus barang.');
       }
    }
  };

  const openFormModalForCreate = () => { 
    setEditingStok(null); 
    setIsFormModalOpen(true); 
  };
  
  const closeFormModal = () => { 
    setIsFormModalOpen(false); 
    setEditingStok(null); 
  };

  const handleOpenListModal = (item) => {
    setItemToSell(item);
    setIsListModalOpen(true);
  };

  const handleCloseListModal = () => {
    setIsListModalOpen(false);
    setItemToSell(null);
  };

  const handleListSuccess = () => {
    fetchData();
    handleCloseListModal();
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };
  
  const handleDownloadPdf = () => {
    if (stok.length === 0) {
      showInfoToast("Tidak ada data stok untuk diunduh.");
      return;
    }

    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();
    const tableColumns = ["No", "Nama Barang", "Jumlah", "Satuan", "ROP", "Status", "Harga / Unit"];
    const tableRows = [];

    let totalNilaiInventaris = 0;
    let totalItemKuantitas = 0;

    stok.forEach((item, index) => {
      const hargaModal = Number(item.hargaBeliTerakhir || item.hargaBeliAwal || 0);
      const jumlah = Number(item.jumlah);
      const totalNilai = hargaModal * jumlah;
      const status = Number(item.jumlah) <= Number(item.batasMinimum) ? 'Perlu Restock' : 'Aman';
      
      totalNilaiInventaris += totalNilai;
      totalItemKuantitas += jumlah;

      const stokData = [
        index + 1,
        item.namaBarang,
        jumlah,
        item.satuan,
        item.batasMinimum,
        status,
        formatRupiah(hargaModal),
      ];
      tableRows.push(stokData);
    });
    
    const date = new Date();
    const dateStr = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    const logoUrl = '/Logo.png';
    const logoWidth = 25;
    const logoX = (pageW / 2) - (logoWidth / 2);

    doc.addImage(logoUrl, 'PNG', logoX, 8, logoWidth, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("Laporan Stok Barang", pageW / 2, 30, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(user?.namaToko || 'StockWatch', pageW / 2, 36, { align: 'center' });
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text("https://stockwatch.web.id", pageW / 2, 41, { align: 'center' });
    doc.setLineWidth(0.5);
    doc.line(14, 46, pageW - 14, 46);
    
    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: 52,
      theme: 'grid',
      headStyles: {
        fillColor: [22, 163, 74], 
        textColor: 255,
        fontStyle: 'bold'
      },
      didDrawPage: function (data) {
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Halaman ${data.pageNumber} dari ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
        doc.text(`Dicetak pada ${dateStr}`, doc.internal.pageSize.width - data.settings.margin.right, doc.internal.pageSize.height - 10, { align: 'right' });
      },
      margin: { top: 35 }
    });

    const finalY = doc.lastAutoTable.finalY || 52;
    
    if (doc.lastAutoTable && doc.lastAutoTable.finalY) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100);
        doc.text("Catatan : ROP adalah Reorder Point / Batas Minimum yang telah Anda tetapkan.", 14, finalY + 10);
        
        const summaryData = [
            ['Total Varian Barang :', `${stok.length} jenis`],
            ['Total Kuantitas Barang :', `${totalItemKuantitas} unit`],
            ['Total Nilai Inventaris :', formatRupiah(totalNilaiInventaris)]
        ];

        autoTable(doc, {
            body: summaryData,
            startY: finalY + 15,
            theme: 'plain',
            styles: { 
                fontSize: 10,
                textColor: [44, 62, 80],
            },
            columnStyles: {
                0: { fontStyle: 'bold', halign: 'left', cellWidth: 50 },
                1: { halign: 'left' },
            }
        });
    }
    
    doc.save(`laporan-stok-${user?.namaToko?.replace(/\s/g, '-') || 'stockwatch'}-${date.toISOString().slice(0,10)}.pdf`);
  };

  const renderStokTable = () => {
    if (loading && stok.length === 0) {
        return (
            <div className="table-container">
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Nama Barang</th>
                                <th>Jumlah</th>
                                <th>Satuan</th>
                                <th>ROP</th>
                                <th>Status</th>
                                <th>Harga / Unit</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td colSpan="8" style={{ textAlign: 'center' }}>Memuat data...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
    
    return (
        <div className="table-container">
            <div className="table-responsive">
                <table className="data-table">
                    <thead>
                        <tr>
                        <th>No</th>
                        <th>Nama Barang</th>
                        <th>Jumlah</th>
                        <th>Satuan</th>
                        <th>ROP</th>
                        <th>Status</th>
                        <th>Harga / Unit</th>
                        <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentStockItems.length > 0 ? (
                            currentStockItems.map((item, index) => {
                                const hargaModalUnit = Number(item.hargaBeliTerakhir || item.hargaBeliAwal || 0);
                                const isKritis = Number(item.jumlah) <= Number(item.batasMinimum);

                                return (
                                    <tr key={item.id}>
                                        <td>{(halamanSaatIni - 1) * ITEM_PER_HALAMAN + index + 1}</td>
                                        <td>{item.namaBarang}</td>
                                        <td>{item.jumlah}</td>
                                        <td>{item.satuan}</td>
                                        <td>{item.batasMinimum}</td>
                                        <td>
                                            {isKritis ? (
                                            <span className="status-badge status-restock">Perlu Restock</span>
                                            ) : (
                                            <span className="status-badge status-aman">Aman</span>
                                            )}
                                        </td>
                                        <td>{formatRupiah(hargaModalUnit)}</td>
                                        <td className="action-buttons">
                                            <button onClick={() => handleEdit(item)} className="button-edit">Edit</button>
                                            <button onClick={() => handleDelete(item.id, item.namaBarang)} className="button-delete">Hapus</button>
                                            <button onClick={() => handleOpenListModal(item)} className="button-list-stock">Jual</button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr><td colSpan="8" style={{ textAlign: 'center' }}></td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            {!loading && stok.length > 0 && totalHalaman > 1 && (
                <div className="pagination-controls">
                <button onClick={() => gantiHalaman(halamanSaatIni - 1)} disabled={halamanSaatIni <= 1}>Sebelumnya</button>
                <span>Halaman {halamanSaatIni} dari {totalHalaman}</span>
                <button onClick={() => gantiHalaman(halamanSaatIni + 1)} disabled={halamanSaatIni >= totalHalaman}>Berikutnya</button>
                </div>
            )}
        </div>
    );
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Daftar Stok Barang</h2>
        <div className="header-actions">
            <button onClick={handleDownloadPdf} className="button-secondary">Unduh Laporan PDF</button>
            <button onClick={openFormModalForCreate} className="button-add">+ Tambah Stok Baru</button>
        </div>
      </div>
      
      {renderStokTable()}

      <p className="page-note">
        <strong>Catatan:</strong> ROP adalah Reorder Point / Batas Minimum yang telah Anda tetapkan.
      </p>

      <Modal title={editingStok ? 'Edit Stok Barang' : 'Tambah Stok Baru'} isOpen={isFormModalOpen} onClose={closeFormModal}>
        <StokForm onSuccess={handleFormSuccess} onClose={closeFormModal} initialData={editingStok}/>
      </Modal>

      {isListModalOpen && (
        <Modal title={`Jual "${itemToSell?.namaBarang}" di StockShare`} isOpen={isListModalOpen} onClose={handleCloseListModal}>
          <ListStokForm itemToSell={itemToSell} onSuccess={handleListSuccess} onClose={handleCloseListModal}/>
        </Modal>
      )}
    </div>
  );
}

export default StockListPage;