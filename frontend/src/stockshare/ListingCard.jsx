import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale'; 

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
    catatan,
    createdAt 
  } = listing;

  const whatsappNumber = kontakWhatsApp.startsWith('62') ? kontakWhatsApp : `62${kontakWhatsApp.substring(1)}`;
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  let waktuPosting = '';
  if (createdAt) {
    waktuPosting = formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: id });
  }

  return (
    <div className="listing-card">
      <div className="card-header">
        <div className="card-item-details">
          <h3 className="card-item-name">{namaBarang}</h3>
          <p className="card-price">{formatRupiah(hargaPerUnit)} / {satuan}</p>
        </div>
        <div className="card-listing-info">
          <img 
            src="https://scontent.fupg3-1.fna.fbcdn.net/v/t39.30808-6/504679677_122112574616877950_6728358399841732826_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGeeaa_tA0hlbzBs--LnV53KcEZlK5n0PkpwRmUrmfQ-U90qyDLakkGakX9LuExqZhQXFdQRfWaqpDsH8Ujb5Y4&_nc_ohc=KM3CqVbNtu8Q7kNvwEFP7SE&_nc_oc=AdmrmRisALA_CmLkRygG5miSPgPZ9S4p9kNadidpVJdqdrrB9IdfRrUb92L8dvtW1Ag&_nc_zt=23&_nc_ht=scontent.fupg3-1.fna&_nc_gid=W2azWJOqvvBTbku9KidL3A&oh=00_AfPwFKyrx1EgwAjTuRrmtl4tcg221gc8ke89wTRqcn5zkw&oe=684A6EDE" // Ganti dengan URL logo Anda yang lebih kecil jika ada
            alt="StockWatch Logo" 
            className="card-sw-logo"
          />
          {waktuPosting && <small className="card-timestamp">Diposting {waktuPosting}</small>}
        </div>
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