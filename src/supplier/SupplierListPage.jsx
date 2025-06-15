import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllSuppliers, createSupplier, updateSupplier, deleteSupplier as deleteSupplierService } from './supplierService';
import { showSuccessToast, showErrorToast, showInfoToast } from '../utils/toastHelper';
import Modal from '../components/Modal';
import SupplierForm from './SupplierForm';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../styles/DashboardPages.css';

const ITEMS_PER_PAGE_SUPPLIER = 10;

function SupplierListPage() {
  const { user } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchSuppliers = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getAllSuppliers();
      setSuppliers(response.data.data || []);
    } catch (err) {
      const fetchError = err.response?.data?.message || 'Gagal memuat data supplier.';
      setError(fetchError);
      showErrorToast(fetchError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [suppliers.length]);

  const { currentSupplierItems, totalPages } = useMemo(() => {
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE_SUPPLIER;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE_SUPPLIER;
    const currentItems = suppliers.slice(indexOfFirstItem, indexOfLastItem);
    const pages = Math.ceil(suppliers.length / ITEMS_PER_PAGE_SUPPLIER);
    return { currentSupplierItems: currentItems, totalPages: pages };
  }, [suppliers, currentPage]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleOpenModalForCreate = () => {
    setEditingSupplier(null);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (supplier) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSupplier(null);
  };

  const handleFormSuccess = async (formData, isEdit, supplierId) => {
    setIsLoading(true);
    try {
      if (isEdit) {
        await updateSupplier(supplierId, formData);
        showSuccessToast('Supplier berhasil diperbarui!');
      } else {
        await createSupplier(formData);
        showSuccessToast('Supplier berhasil ditambahkan!');
      }
      fetchSuppliers();
    } catch (err) {
      showErrorToast(err.response?.data?.message || 'Gagal menyimpan data supplier.');
    } finally {
      setIsLoading(false);
      handleCloseModal();
    }
  };

  const handleDeleteSupplier = async (supplierId, supplierName) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus supplier "${supplierName}"?`)) {
      try {
        await deleteSupplierService(supplierId);
        showSuccessToast('Supplier berhasil dihapus!');
        fetchSuppliers();
      } catch (err) {
        showErrorToast(err.response?.data?.message || 'Gagal menghapus supplier.');
      }
    }
  };

  const handleDownloadPdf = () => {
    if (suppliers.length === 0) {
      showInfoToast("Tidak ada data supplier untuk diunduh.");
      return;
    }
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();
    const tableColumns = ["No", "Nama Supplier", "Barang Disuplai", "Harga / Unit", "Nomor Telepon"];
    const tableRows = [];

    suppliers.forEach((supplier, index) => {
      const supplierData = [
        index + 1,
        supplier.namaSupplier,
        supplier.barangDisuplai || '-',
        supplier.hargaBarangDariSupplier || '-',
        supplier.nomorTelepon || '-',
      ];
      tableRows.push(supplierData);
    });
    
    const date = new Date();
    const dateStr = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    const logoUrl = '/Logo.png';
    const logoWidth = 25;
    const logoX = (pageW / 2) - (logoWidth / 2);

    doc.addImage(logoUrl, 'PNG', logoX, 8, logoWidth, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("Laporan Daftar Supplier", pageW / 2, 30, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(user?.namaToko || 'StockWatch', pageW / 2, 36, { align: 'center' });
    
    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: 42,
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
        doc.text(`Dicetak pada: ${dateStr}`, doc.internal.pageSize.width - data.settings.margin.right, doc.internal.pageSize.height - 10, { align: 'right' });
      },
    });
    
    doc.save(`laporan-supplier-${user?.namaToko?.replace(/\s/g, '-') || 'stockwatch'}-${date.toISOString().slice(0,10)}.pdf`);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Manajemen Supplier</h2>
        <div className="header-actions">
            <button onClick={handleDownloadPdf} className="button-secondary">Unduh PDF</button>
            <button onClick={handleOpenModalForCreate} className="button-add">
            + Tambah Supplier Baru
            </button>
        </div>
      </div>

      <div className="table-container">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nama Supplier</th>
                <th>Barang Disuplai</th>
                <th>Nomor Telepon</th>
                <th>Email</th>
                <th>Alamat</th>
                <th>Info Harga</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center' }}>Memuat data supplier...</td></tr>
              ) : currentSupplierItems.length > 0 ? (
                currentSupplierItems.map((supplier) => (
                  <tr key={supplier.id}>
                    <td>{supplier.namaSupplier}</td>
                    <td>{supplier.barangDisuplai || '-'}</td>
                    <td>{supplier.nomorTelepon || '-'}</td>
                    <td>{supplier.emailSupplier || '-'}</td>
                    <td>{supplier.alamatSupplier || '-'}</td>
                    <td>{supplier.hargaBarangDariSupplier || '-'}</td>
                    <td className="action-buttons">
                      <button onClick={() => handleOpenModalForEdit(supplier)} className="button-edit">Edit</button>
                      <button onClick={() => handleDeleteSupplier(supplier.id, supplier.namaSupplier)} className="button-delete">Hapus</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" style={{ textAlign: 'center' }}></td></tr>
              )}
            </tbody>
          </table>
        </div>
        {!isLoading && suppliers.length > 0 && totalPages > 1 && (
            <div className="pagination-controls">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage <= 1}>Sebelumnya</button>
            <span>Halaman {currentPage} dari {totalPages}</span>
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage >= totalPages}>Berikutnya</button>
            </div>
        )}
      </div>
      
      {isModalOpen && (
        <Modal 
          title={editingSupplier ? 'Edit Supplier' : 'Tambah Supplier Baru'} 
          isOpen={isModalOpen} 
          onClose={handleCloseModal}
        >
          <SupplierForm 
            onSuccess={handleFormSuccess} 
            onClose={handleCloseModal}
            initialData={editingSupplier}
          />
        </Modal>
      )}
    </div>
  );
}

export default SupplierListPage;