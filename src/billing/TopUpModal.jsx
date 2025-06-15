import React from 'react';
import './TopUpModal.css';

function TopUpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay-billing" onClick={onClose}>
      <div className="modal-content-billing" onClick={e => e.stopPropagation()}>
        <div className="modal-header-billing">
          <h3>Top Up Saldo StockWatch</h3>
          <button onClick={onClose} className="modal-close-btn">×</button>
        </div>
        <div className="modal-body-billing">
          <div className="qris-section">
            <img 
              src="/qris.jpg" 
              alt="QRIS Code for Top Up" 
              className="qris-image"
            />
          </div>
          <div className="instructions-section">
            <h4>Cara TopUp :</h4>
            <ol className="instructions-list">
              <li>Silakan Pindai (Scan) Kode QRIS di Atas Menggunakan Aplikasi Perbankan atau E-Wallet Anda.</li>
              <li>Masukkan Jumlah Saldo Yang Ingin Anda Isi.</li>
              <li>Setelah Pembayaran Berhasil, Kirimkan Bukti Transfer Ke Salah Satu Kontak Dibawah Ini Untuk Konfirmasi.</li>
            </ol>
            <div className="contact-info-topup">
              <p><strong>WhatsApp :</strong> 0896-4314-3750</p>
              <p><strong>Email :</strong> support@stockwatch.web.id</p>
            </div>
            <small>Saldo akan ditambahkan oleh admin ke akun Anda dalam waktu maksimal 1x24 jam setelah konfirmasi.</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopUpModal;