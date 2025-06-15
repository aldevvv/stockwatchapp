import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getAllListings } from './stockshareService';
import ListingCard from './ListingCard';
import { showErrorToast } from '../utils/toastHelper';
import '../styles/DashboardPages.css';
import './StockMarketPage.css';

const ITEMS_PER_PAGE = 9;

function StockMarketPage() {
  const [allListings, setAllListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllListings();
      setAllListings(response.data.data || []);
    } catch (err) {
      showErrorToast(err.response?.data?.message || 'Gagal memuat data StockShare.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const filteredListings = useMemo(() => {
    if (!searchTerm) return allListings;
    const lowercasedFilter = searchTerm.toLowerCase();
    return allListings.filter(listing => 
      listing.namaBarang?.toLowerCase().includes(lowercasedFilter) ||
      listing.namaToko?.toLowerCase().includes(lowercasedFilter)
    );
  }, [searchTerm, allListings]);

  const { currentItems, totalPages } = useMemo(() => {
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const items = filteredListings.slice(indexOfFirstItem, indexOfLastItem);
    const pages = Math.ceil(filteredListings.length / ITEMS_PER_PAGE);
    return { currentItems: items, totalPages: pages };
  }, [filteredListings, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>StockMarket</h1>
        <p>Temukan Surplus Stok Dari UMKM Lain di Sekitar Anda.</p>
      </div>

      <div className="filters-container">
        <input
          type="text"
          placeholder="Cari nama barang atau nama toko..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="stockshare-search-input"
        />
      </div>

      {isLoading ? (
        <p>Memuat listing...</p>
      ) : currentItems.length > 0 ? (
        <>
          <div className="listings-grid">
            {currentItems.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination-controls market-pagination">
              <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>‹ Sebelumnya</button>
              <span>Halaman {currentPage} dari {totalPages}</span>
              <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>Berikutnya ›</button>
            </div>
          )}
        </>
      ) : (
        <p>Belum ada stok yang dijual atau tidak ada yang cocok dengan pencarian Anda.</p>
      )}
    </div>
  );
}

export default StockMarketPage;
