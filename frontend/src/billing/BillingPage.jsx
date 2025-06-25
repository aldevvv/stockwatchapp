import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSaldoHistory } from './billingService';
import { getAllStok } from '../stok/stokService';
import { getAllSuppliers } from '../supplier/supplierService';
import { getAllProduk } from '../produk/produkService';
import InvoiceModal from './InvoiceModal';
import TopUpModal from './TopUpModal';
import '../styles/DashboardPages.css';
import './BillingPage.css';

const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);

const PLAN_LIMITS_FRONTEND = {
  Free: { stok: 10, produk: 10, supplier: 5 },
  Basic: { stok: 75, produk: 75, supplier: 50 },
  Pro: { stok: Infinity, produk: Infinity, supplier: Infinity },
  Enterprise: { stok: Infinity, produk: Infinity, supplier: Infinity },
};

function PlanAccessModal({ isOpen, onClose, userPlan, usageStats }) {
  if (!isOpen) return null;

  const limits = PLAN_LIMITS_FRONTEND[userPlan] || PLAN_LIMITS_FRONTEND['Free'];

  const renderLimit = (label, used, limit) => {
    const percentage = limit === Infinity ? 100 : (used / limit) * 100;
    return (
      <div className="usage-item" key={label}>
        <div className="usage-label">
          <span>{label}</span>
          <span>{used} / {limit === Infinity ? '∞' : limit}</span>
        </div>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${Math.min(percentage, 100)}%` }}></div>
        </div>
      </div>
    );
  };

  return (
    <div className="modal-overlay-billing" onClick={onClose}>
      <div className="modal-content-billing" onClick={e => e.stopPropagation()}>
        <div className="modal-header-billing">
          <h3>Detail Akses Paket {userPlan}</h3>
          <button onClick={onClose} className="modal-close-btn">×</button>
        </div>
        <div className="modal-body-billing">
          {renderLimit("Produk", usageStats.produk, limits.produk)}
          {renderLimit("Stok", usageStats.stok, limits.stok)}
          {renderLimit("Supplier", usageStats.supplier, limits.supplier)}
        </div>
      </div>
    </div>
  );
}

function BillingPage() {
  const { user } = useAuth();
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [history, setHistory] = useState([]);
  const [usageStats, setUsageStats] = useState({ stok: 0, supplier: 0, produk: 0 });
  const [remainingDays, setRemainingDays] = useState('Selamanya');

  useEffect(() => {
    if (user?.planExpiry) {
        const now = Date.now();
        const expiry = user.planExpiry;
        if (expiry > now) {
            const diff = expiry - now;
            const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
            setRemainingDays(`${days} Hari`);
        } else {
            setRemainingDays('Kedaluwarsa');
        }
    } else if (user?.plan && user.plan !== 'Free') {
        setRemainingDays('Menunggu Pembayaran');
    } else {
        setRemainingDays('Selamanya');
    }
  }, [user]);

  const fetchData = useCallback(async () => {
    try {
      const [historyRes, stokRes, supRes, prodRes] = await Promise.all([
        getSaldoHistory(),
        getAllStok(),
        getAllSuppliers(),
        getAllProduk()
      ]);
      setHistory(historyRes.data.data || []);
      setUsageStats({
          stok: stokRes.data.data?.length || 0,
          supplier: supRes.data.data?.length || 0,
          produk: prodRes.data.data?.length || 0,
      });
    } catch (error) {
      console.error("Gagal memuat data halaman billing:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setIsInvoiceModalOpen(true);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Langganan & Saldo</h2>
      </div>

      <div className="billing-grid">
        <div className="billing-card">
          <h3 className="card-title">Paket Anda Saat Ini</h3>
          <p className="plan-name">{user?.plan || 'Free'}</p>
          <div className="card-actions">
            <button onClick={() => setIsPlanModalOpen(true)} className="button-add">Lihat Detail Paket</button>
          </div>
        </div>

        <div className="billing-card">
          <h3 className="card-title">Sisa Durasi Plan</h3>
          <p className="plan-duration">{remainingDays}</p>
          <div className="card-actions">
          </div>
        </div>

        <div className="billing-card">
          <h3 className="card-title">Saldo Akun</h3>
          <p className="saldo-amount">{formatRupiah(user?.saldo || 0)}</p>
          <div className="card-actions">
            <button className="button-add" onClick={() => setIsTopUpModalOpen(true)}>Top Up Saldo</button>
          </div>
        </div>
      </div>

      <div className="table-container" style={{marginTop: '2rem'}}>
        <h3 className="table-title">Riwayat Saldo</h3>
        <div className="table-responsive">
            <table className="data-table">
                <thead><tr><th>Tanggal</th><th>Deskripsi</th><th>Jumlah</th><th>Aksi</th></tr></thead>
                <tbody>
                    {history.length > 0 ? history.map(h => (
                        <tr key={h.id}>
                            <td>{new Date(h.tanggal).toLocaleDateString('id-ID')}</td>
                            <td>{h.deskripsi}</td>
                            <td className={h.jumlah > 0 ? 'saldo-positive' : 'saldo-negative'}>{formatRupiah(h.jumlah)}</td>
                            <td className="action-buttons">
                                <button className="button-edit" onClick={() => handleOpenInvoice(h)}>Invoice</button>
                            </td>
                        </tr>
                    )) : <tr><td colSpan="4" style={{textAlign:'center'}}>Belum ada riwayat saldo.</td></tr>}
                </tbody>
            </table>
        </div>
      </div>
      
      <PlanAccessModal isOpen={isPlanModalOpen} onClose={() => setIsPlanModalOpen(false)} userPlan={user?.plan} usageStats={usageStats} />
      <InvoiceModal isOpen={isInvoiceModalOpen} onClose={() => setIsInvoiceModalOpen(false)} invoiceData={selectedInvoice} />
      <TopUpModal isOpen={isTopUpModalOpen} onClose={() => setIsTopUpModalOpen(false)} />
    </div>
  );
}
export default BillingPage;