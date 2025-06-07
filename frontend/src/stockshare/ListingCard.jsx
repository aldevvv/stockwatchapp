// frontend/src/stockshare/ListingCard.jsx
import React from 'react';

// Fungsi untuk format mata uang Rupiah
const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
};

function ListingCard({ listing }) {
  const { 
    namaBarang, 
    hargaPerUnit, 
    jumlahDitawarkan, 
    satuan, 
    namaToko, 
    kontakWhatsApp,
    catatan
  } = listing;

  const whatsappNumber = kontakWhatsApp.startsWith('62') ? kontakWhatsApp : `62${kontakWhatsApp.substring(1)}`;
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="listing-card">
      <div className="card-header">
        <h3 className="card-item-name">{namaBarang}</h3>
        <p className="card-price">{formatRupiah(hargaPerUnit)} / {satuan}</p>
      </div>
      <div className="card-body">
        <p className="card-info"><strong>Tersedia :</strong> {jumlahDitawarkan} {satuan}</p>
        <p className="card-info"><strong>Dijual oleh :</strong> {namaToko}</p>
        {catatan && <p className="card-note"><strong>Catatan :</strong> {catatan}</p>}
      </div>
      <div className="card-footer">
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="button-contact">
          Hubungi Penjual
        </a>
      </div>
    </div>
  );
}

export default ListingCard;