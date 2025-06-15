import React from 'react';
import './TestimonialsPage.css';

function TestimonialsPage() {
  const testimonials = [
    {
      quote: "StockWatch benar-benar mengubah cara saya mengelola stok di cafe. Notifikasi WhatsApp-nya sangat membantu, saya tidak pernah kehabisan biji kopi lagi!",
      name: "Budi Santoso",
      role: "Pemilik Cafe Senja",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrWl3NFJnWwwjlBSSbNxJcQ2EpYbFhtX4M0Q&s",
    },
    {
      quote: "Sebagai pemilik toko kelontong kecil, aplikasi ini sangat mudah digunakan. Saya bisa tahu barang mana yang paling laku dan kapan harus restock. Sangat direkomendasikan!",
      name: "Siti Aminah",
      role: "Pemilik Toko Berkah Jaya",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrWl3NFJnWwwjlBSSbNxJcQ2EpYbFhtX4M0Q&s",
    },
    {
      quote: "Fitur laporannya sederhana tapi sangat berguna untuk rekap bulanan. Saya jadi bisa mengontrol modal dengan lebih baik. Terima kasih StockWatch!",
      name: "Rahmat Hidayat",
      role: "Manajer Distro Kreatif",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrWl3NFJnWwwjlBSSbNxJcQ2EpYbFhtX4M0Q&s",
    },
    {
      quote: "Awalnya saya ragu, tapi ternyata aplikasinya ringan dan tidak ribet. Sangat cocok untuk saya yang tidak terlalu paham teknologi. Stok jadi lebih teratur.",
      name: "Dewi Lestari",
      role: "Pemilik Katering Dapur Ibu",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrWl3NFJnWwwjlBSSbNxJcQ2EpYbFhtX4M0Q&s",
    },
    {
      quote: "StockShare adalah ide brilian! Saya bisa menjual kelebihan stok bahan kue ke sesama UMKM. Ini sangat membantu perputaran uang di bisnis saya.",
      name: "Agus Wijaya",
      role: "Pemilik Bakery Maju",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrWl3NFJnWwwjlBSSbNxJcQ2EpYbFhtX4M0Q&s",
    }
  ];

  return (
    <div className="testimonials-page-container">
      <div className="testimonials-header">
        <h1>Apa Kata Mereka Tentang StockWatch?</h1>
        <p>Ulasan nyata dari para pemilik UMKM yang telah merasakan manfaat aplikasi kami.</p>
      </div>

      <div className="testimonials-marquee-container">
        <div className="testimonials-track">
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <blockquote className="testimonial-quote">
                “{testimonial.quote}”
              </blockquote>
              <div className="testimonial-author">
                <img src={testimonial.img} alt={testimonial.name} className="author-img" />
                <div className="author-info">
                  <cite className="author-name">{testimonial.name}</cite>
                  <span className="author-role">{testimonial.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TestimonialsPage;