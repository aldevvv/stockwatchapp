import React from 'react';
import './InfoPage.css'; 
import './TestimonialsPage.css'; 

function TestimonialsPage() {
  const testimonials = [
    {
      quote: "StockWatch mengubah cara saya mengelola stok kopi dan bahan baku. Notifikasi WhatsApp-nya sangat membantu, tidak ada lagi drama kehabisan stok di akhir pekan! UI-nya juga ramah pengguna.",
      name: "Andi",
      company: "Pemilik Kopi Senja"
    },
    {
      quote: "Dulu pusing catat stok manual, sekarang semua terdata rapi di StockWatch. Fitur batas minimumnya cerdas, jadi saya tahu kapan harus order barang lagi. Sangat direkomendasikan untuk toko seperti saya.",
      name: "Ibu Siti",
      company: "Toko Amanah Jaya"
    },
    {
      quote: "Sebagai penjual online, kecepatan update stok sangat krusial. Dashboard real-time StockWatch membuat saya selalu tahu sisa stok setiap varian produk. Jadi tidak ada lagi salah order dari pelanggan.",
      name: "Rina",
      company: "Owner GayaKita Store"
    },
    {
      quote: "Dengan StockWatch, saya bisa memantau stok bahan makanan dengan mudah, bahkan dari rumah. Ini membantu mengurangi pemborosan bahan dan memastikan menu selalu tersedia. Harganya juga sangat terjangkau untuk UMKM.",
      name: "Pak Budi",
      company: "Warung Makan Nikmat"
    },
    {
      quote: "Saya mengelola banyak item dari berbagai supplier. StockWatch memudahkan saya melacak semua pergerakan barang. Fitur laporannya (meskipun dasar) cukup membantu untuk evaluasi bulanan.",
      name: "Ahmad",
      company: "Distribusi Berkah"
    },
    {
      quote: "Notifikasi email dan WhatsApp sangat membantu di tengah kesibukan dapur. Saya tidak perlu khawatir lagi kehabisan bahan penting untuk pesanan katering. Aplikasi yang wajib punya!",
      name: "Ibu Linda",
      company: "Linda Katering"
    }
  ];

  return (
    <div className="testimonials-page-containerr">
      <div className="testimonials-page-container">
        <h1>Apa Kata Pengguna StockWatch?</h1>
        <p className="testimonials-intro">
          Dengarkan pengalaman langsung dari para pelaku UMKM yang telah merasakan manfaat StockWatch dalam mengelola inventaris bisnis mereka.
        </p>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <p className="testimonial-quote">"{testimonial.quote}"</p>
              <p className="testimonial-author">- {testimonial.name}, {testimonial.company}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TestimonialsPage;