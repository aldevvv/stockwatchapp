import React from 'react';
import './UserDetailModal.css';

const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric'
    });
};

function UserDetailModal({ isOpen, onClose, userDetails }) {
  if (!isOpen || !userDetails) return null;

  const { profile, jumlahStok, jumlahSupplier, jumlahProduk } = userDetails;

  let sisaDurasi = 'Selamanya';
  if (profile.planExpiry) {
      const sisaMilidetik = profile.planExpiry - Date.now();
      if (sisaMilidetik > 0) {
          const sisaHari = Math.ceil(sisaMilidetik / (1000 * 60 * 60 * 24));
          sisaDurasi = `${sisaHari} hari lagi`;
      } else {
          sisaDurasi = 'Kedaluwarsa';
      }
  }

  return (
    <div className="modal-overlay-admin" onClick={onClose}>
      <div className="modal-content-admin" onClick={e => e.stopPropagation()}>
        <div className="modal-header-admin">
          <h3>Detail Pengguna - {profile.namaLengkap}</h3>
          <button onClick={onClose} className="modal-close-btn-admin">×</button>
        </div>
        <div className="modal-body-admin">
            <div className="detail-grid">
                <div className="detail-item"><span>Nama Toko</span><strong>{profile.namaToko}</strong></div>
                <div className="detail-item"><span>Email</span><strong>{profile.email}</strong></div>
                <div className="detail-item"><span>No. WhatsApp</span><strong>{profile.nomorWhatsAppNotifikasi}</strong></div>
                <div className="detail-item"><span>Bergabung Sejak</span><strong>{formatTimestamp(profile.createdAt)}</strong></div>
                <div className="detail-item"><span>Paket Saat Ini</span><strong>{profile.plan || 'Free'}</strong></div>
                <div className="detail-item"><span>Sisa Durasi Paket</span><strong>{sisaDurasi}</strong></div>
                <div className="detail-item"><span>Saldo</span><strong>Rp {profile.saldo?.toLocaleString('id-ID') || 0}</strong></div>
                <div className="detail-item"><span>Jumlah Stok</span><strong>{jumlahStok} Item</strong></div>
                <div className="detail-item"><span>Jumlah Supplier</span><strong>{jumlahSupplier} Supplier</strong></div>
                <div className="detail-item"><span>Jumlah Produk</span><strong>{jumlahProduk} Produk</strong></div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetailModal;