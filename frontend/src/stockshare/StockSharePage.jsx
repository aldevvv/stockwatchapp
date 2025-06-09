import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getAllListings, getMyListings, deleteMyListing } from './stockshareService';
import ListingCard from './ListingCard';
import Modal from '../components/Modal';
import ListStokForm from './ListStokForm';
import { showErrorToast, showSuccessToast, showInfoToast } from '../utils/toastHelper';
import './StockSharePage.css';

function StockSharePage() {
  const [allListings, setAllListings] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState('marketplace');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState(null);

  const fetchMarketplaceListings = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getAllListings();
      setAllListings(response.data.data || []);
    } catch (err) {
      showErrorToast(err.response?.data?.message || 'Gagal memuat data pasar StockShare.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMyListings = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getMyListings();
      setMyListings(response.data.data || []);
    } catch (err) {
      showErrorToast(err.response?.data?.message || 'Gagal memuat data listing Anda.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeView === 'marketplace') {
      fetchMarketplaceListings();
    } else if (activeView === 'myListings') {
      fetchMyListings();
    }
  }, [activeView, fetchMarketplaceListings, fetchMyListings]);

  const filteredMarketplaceListings = useMemo(() => {
    if (!searchTerm) return allListings;
    const lowercasedFilter = searchTerm.toLowerCase();
    return allListings.filter(listing => 
      listing.namaBarang?.toLowerCase().includes(lowercasedFilter) ||
      listing.namaToko?.toLowerCase().includes(lowercasedFilter)
    );
  }, [searchTerm, allListings]);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  const handleOpenEditModal = (listing) => {
    setEditingListing(listing);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingListing(null);
  };

  const handleEditSuccess = () => {
    handleCloseEditModal();
    fetchMyListings();
  };

  const handleDeleteListing = async (listingId, namaBarang) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus listing untuk "${namaBarang}"?`)) {
      try {
        await deleteMyListing(listingId);
        showSuccessToast("Listing berhasil dihapus.");
        fetchMyListings();
      } catch (err) {
        showErrorToast(err.response?.data?.message || "Gagal menghapus listing.");
      }
    }
  };


  return (
    <div className="stockshare-page">
      <div className="page-header">
        <h1>StockShare</h1>
        <p className="page-subheader">Temukan Surplus Stok dari UMKM Lain di Sekitar Anda.</p>
      </div>

      <div className="stockshare-submenu-nav">
        <button 
          className={`submenu-button ${activeView === 'marketplace' ? 'active' : ''}`}
          onClick={() => setActiveView('marketplace')}
        >
          StockMarket
        </button>
        <button 
          className={`submenu-button ${activeView === 'myListings' ? 'active' : ''}`}
          onClick={() => setActiveView('myListings')}
        >
          Daftar Listing
        </button>
      </div>

      <div className="stockshare-content">
        {activeView === 'marketplace' && (
          <div>
            <div className="stockshare-controls">
              <input
                type="text"
                placeholder="Cari nama barang atau nama toko..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="stockshare-search-input"
              />
            </div>
            {isLoading ? <p>Memuat listing...</p> : 
              error ? <p className="error-message">{error}</p> :
              filteredMarketplaceListings.length > 0 ? (
                <div className="listings-grid">
                  {filteredMarketplaceListings.map(listing => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              ) : <p>Belum ada stok yang dijual di StockShare saat ini atau tidak ada yang cocok dengan pencarian Anda.</p>
            }
          </div>
        )}

        {activeView === 'myListings' && (
          <div>
            {isLoading ? <p>Memuat listing Anda...</p> : 
              error ? <p className="error-message">{error}</p> :
              myListings.length > 0 ? (
                <div className="table-responsive">
                    <table className="my-listings-table">
                    <thead>
                        <tr>
                        <th>Nama Barang</th>
                        <th>Jumlah Ditawarkan</th>
                        <th>Harga per Unit</th>
                        <th>Status</th>
                        <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myListings.map(listing => (
                        <tr key={listing.id}>
                            <td>{listing.namaBarang}</td>
                            <td>{listing.jumlahDitawarkan} {listing.satuan}</td>
                            <td>{formatRupiah(listing.hargaPerUnit)}</td>
                            <td><span className={`status-badge ${listing.status === 'TERSEDIA' ? 'status-tersedia' : 'status-terjual'}`}>{listing.status}</span></td>
                            <td className="action-buttons">
                              <button onClick={() => handleOpenEditModal(listing)} className="button-edit">Edit</button>
                              <button onClick={() => handleDeleteListing(listing.id, listing.namaBarang)} className="button-delete">Hapus</button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
              ) : <p>Anda belum memiliki barang yang dijual di StockShare. Anda bisa menjual dari halaman Dashboard.</p>
            }
          </div>
        )}
      </div>

      {isEditModalOpen && (
        <Modal
          title={`Edit Listing: "${editingListing?.namaBarang}"`}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
        >
          <ListStokForm 
            onSuccess={handleEditSuccess}
            onClose={handleCloseEditModal}
            isEditMode={true}
            initialListingData={editingListing}
          />
        </Modal>
      )}
    </div>
  );
}

export default StockSharePage;