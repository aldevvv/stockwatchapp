import React, { useState, useEffect, useCallback } from 'react';
import { getMyListings, deleteMyListing } from './stockshareService';
import { showSuccessToast, showErrorToast } from '../utils/toastHelper';
import Modal from '../components/Modal';
import '../styles/DashboardPages.css';

function DaftarListingPage() {
  const [myListings, setMyListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);

  const fetchMyListings = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getMyListings();
      setMyListings(response.data.data || []);
    } catch (error) {
      showErrorToast("Gagal memuat data listing Anda.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyListings();
  }, [fetchMyListings]);

  const handleOpenDeleteConfirm = (listing) => {
    setListingToDelete(listing);
    setIsDeleteConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setListingToDelete(null);
    setIsDeleteConfirmOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!listingToDelete) return;
    try {
      await deleteMyListing(listingToDelete.id);
      showSuccessToast("Listing berhasil dihapus.");
      fetchMyListings();
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Gagal menghapus listing.");
    } finally {
      handleCloseDeleteConfirm();
    }
  };

  const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Daftar Listing Saya di StockShare</h2>
      </div>

      <div className="table-container">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nama Barang</th>
                <th>Jumlah Ditawarkan</th>
                <th>Harga per Unit</th>
                <th>Status</th>
                <th>Catatan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="6" style={{textAlign: 'center'}}>Memuat listing...</td></tr>
              ) : myListings.length > 0 ? (
                myListings.map(listing => (
                  <tr key={listing.id}>
                    <td>{listing.namaBarang}</td>
                    <td>{listing.jumlahDitawarkan} {listing.satuan}</td>
                    <td>{formatRupiah(listing.hargaPerUnit)}</td>
                    <td><span className={`status-badge status-tersedia`}>{listing.status}</span></td>
                    <td>{listing.catatan || '-'}</td>
                    <td className="action-buttons">
                      <button className="button-delete" onClick={() => handleOpenDeleteConfirm(listing)}>Hapus</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" style={{textAlign: 'center'}}>Anda belum memiliki barang yang dijual di StockShare.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isDeleteConfirmOpen && (
        <Modal 
            title="Konfirmasi Hapus Listing"
            isOpen={isDeleteConfirmOpen}
            onClose={handleCloseDeleteConfirm}
        >
            <div className="confirm-delete-modal">
                <p>Apakah Anda yakin ingin menghapus listing untuk <strong>"{listingToDelete?.namaBarang}"</strong>?</p>
                <p>Aksi ini tidak dapat diurungkan.</p>
                <div className="modal-actions">
                    <button onClick={handleCloseDeleteConfirm} className="button-cancel">Batal</button>
                    <button onClick={handleConfirmDelete} className="button-danger">Ya, Hapus</button>
                </div>
            </div>
        </Modal>
      )}
    </div>
  );
}

export default DaftarListingPage;