import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getAllProduk } from '../produk/produkService';
import { createTransaksi } from './penjualanService';
import { showErrorToast, showSuccessToast } from '../utils/toastHelper';
import { useAchievements } from '../context/AchievementContext';
import './PosPage.css';

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const MinusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;

function PosPage() {
    const [produkList, setProdukList] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showAchievement } = useAchievements();

    const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);

    const fetchProduk = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getAllProduk();
            setProdukList(response.data.data || []);
        } catch (error) {
            showErrorToast("Gagal memuat daftar produk.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProduk();
    }, [fetchProduk]);

    const filteredProduk = useMemo(() => {
        if (!searchTerm) return produkList;
        return produkList.filter(p => p.namaProduk.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [produkList, searchTerm]);

    const addToCart = (produk) => {
        setCart(currentCart => {
            const existingItem = currentCart.find(item => item.id === produk.id);
            if (existingItem) {
                return currentCart.map(item =>
                    item.id === produk.id ? { ...item, qty: item.qty + 1 } : item
                );
            }
            return [...currentCart, { ...produk, qty: 1 }];
        });
    };

    const updateQty = (produkId, amount) => {
        setCart(currentCart => {
            const updatedCart = currentCart.map(item => {
                if (item.id === produkId) {
                    return { ...item, qty: Math.max(1, item.qty + amount) };
                }
                return item;
            }).filter(item => item.qty > 0);
            return updatedCart;
        });
    };

    const removeFromCart = (produkId) => {
        setCart(currentCart => currentCart.filter(item => item.id !== produkId));
    };

    const cartTotals = useMemo(() => {
        return cart.reduce((acc, item) => {
            acc.totalPenjualan += item.hargaJual * item.qty;
            acc.totalModal += item.hargaModal * item.qty;
            return acc;
        }, { totalPenjualan: 0, totalModal: 0 });
    }, [cart]);

    const laba = cartTotals.totalPenjualan - cartTotals.totalModal;

    const handleSimpanTransaksi = async () => {
        if (cart.length === 0) {
            showErrorToast("Keranjang kosong.");
            return;
        }
        setIsSubmitting(true);
        try {
            const transaksiData = {
                items: cart.map(item => ({
                    produkId: item.id,
                    namaProduk: item.namaProduk,
                    qty: item.qty,
                    hargaJual: item.hargaJual,
                    hargaModal: item.hargaModal,
                })),
                totalPenjualan: cartTotals.totalPenjualan,
                totalModal: cartTotals.totalModal,
                laba,
            };
            const response = await createTransaksi(transaksiData);
            showSuccessToast("Transaksi berhasil disimpan!");
            setCart([]);

            if (response.data.unlockedAchievements && response.data.unlockedAchievements.length > 0) {
                showAchievement(response.data.unlockedAchievements);
            }
        } catch (error) {
            showErrorToast(error.response?.data?.message || "Gagal menyimpan transaksi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="pos-page">
            <div className="produk-panel">
                <div className="panel-header">
                    <h3>Daftar Produk</h3>
                    <div className="search-box">
                        <SearchIcon />
                        <input
                            type="text"
                            placeholder="Cari produk..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="produk-grid">
                    {isLoading ? <p>Memuat produk...</p> : 
                        filteredProduk.map(p => (
                            <div key={p.id} className="produk-card" onClick={() => addToCart(p)}>
                                <span className="produk-name">{p.namaProduk}</span>
                                <span className="produk-price">{formatRupiah(p.hargaJual)}</span>
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className="cart-panel">
                <div className="panel-header">
                    <h3>Keranjang Transaksi</h3>
                </div>
                <div className="cart-items">
                    {cart.length === 0 ? (
                        <p className="cart-empty">Keranjang masih kosong.</p>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="cart-item">
                                <div className="item-details">
                                    <span className="item-name">{item.namaProduk}</span>
                                    <span className="item-price">{formatRupiah(item.hargaJual)}</span>
                                </div>
                                <div className="item-controls">
                                    <button onClick={() => updateQty(item.id, -1)}><MinusIcon /></button>
                                    <span className="item-qty">{item.qty}</span>
                                    <button onClick={() => updateQty(item.id, 1)}><PlusIcon /></button>
                                    <button onClick={() => removeFromCart(item.id)} className="remove-btn"><TrashIcon /></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="cart-summary">
                    <div className="summary-row">
                        <span>Total Omzet</span>
                        <span>{formatRupiah(cartTotals.totalPenjualan)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Total Modal (HPP)</span>
                        <span>{formatRupiah(cartTotals.totalModal)}</span>
                    </div>
                    <div className="summary-row total">
                        <span>Laba</span>
                        <span>{formatRupiah(laba)}</span>
                    </div>
                    <button 
                        className="button-save-transaction"
                        onClick={handleSimpanTransaksi}
                        disabled={cart.length === 0 || isSubmitting}
                    >
                        {isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PosPage;