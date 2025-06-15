import React from 'react';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import './ListingCard.css';

function ListingCard({ listing }) {
  const { user } = useAuth();
  const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);

  let waktuPosting = '';
  if (listing.createdAt) {
    waktuPosting = formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true, locale: id });
  }

  const handleContact = () => {
    const message = `Halo, saya tertarik dengan stok ${listing.namaBarang} yang Anda jual di StockWatch.`;
    const whatsappUrl = `https://wa.me/${listing.kontakWhatsApp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };
  
  return (
    <div className="listing-card">
        <div className="card-header">
            <div className="card-item-details">
                <h3 className="card-item-name">{listing.namaBarang}</h3>
                <p className="card-price">{formatRupiah(listing.hargaPerUnit)} / {listing.satuan}</p>
            </div>
            <img 
                src={listing.fotoProfilUrl || 'https://i.ibb.co/hK3aT2v/default-avatar.png'} 
                alt={listing.namaToko} 
                className="listing-card-logo"
            />
        </div>

        <div className="card-body">
            <p className="card-info"><strong>Dijual oleh :</strong> {listing.namaToko}</p>
            <p className="card-info"><strong>Stok Tersedia :</strong> {listing.jumlahDitawarkan} {listing.satuan}</p>
            {listing.catatan && <p className="card-note">"{listing.catatan}"</p>}
        </div>

        <div className="card-footer">
            <button onClick={handleContact} className="button-contact">Hubungi Penjual</button>
            {waktuPosting && <small className="card-timestamp">Diposting {waktuPosting}</small>}
        </div>
    </div>
  );
}

export default ListingCard;
