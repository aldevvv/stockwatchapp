import React from 'react';
import AccordionItem from '../components/common/AccordionItem';
import './FAQPage.css';

function FAQPage() {
  const faqData = [
    {
      question: 'Apa itu StockWatch?',
      answer: 'StockWatch adalah solusi monitoring stok berbasis web yang dirancang khusus untuk UMKM. Aplikasi ini membantu Anda melacak stok barang secara real-time dengan notifikasi otomatis, dashboard yang mudah dibaca, dan tanpa perlu instalasi rumit.'
    },
    {
      question: 'Apa Bedanya Dengan Menggunakan Microsoft Excel atau Google Sheets?',
      answer: 'Berbeda dengan Excel/Sheets yang manual, StockWatch memberikan notifikasi stok rendah secara otomatis ke Email/WhatsApp, memiliki dashboard visual yang interaktif, dan riwayat stok yang tercatat rapi. Ini mengurangi risiko human error dan menghemat waktu Anda.'
    },
    {
      question: 'Apakah Data Saya Aman?',
      answer: 'Tentu saja. Keamanan data Anda adalah prioritas utama kami. Kami menggunakan Firebase Realtime Database dari Google yang memiliki standar keamanan tinggi dan enkripsi data untuk memastikan semua informasi bisnis Anda aman.'
    },
    {
      question: 'Bagaimana Cara Kerja Notifikasi Stok Rendah?',
      answer: 'Anda dapat mengatur batas stok minimum untuk setiap produk. Ketika jumlah stok suatu barang mencapai atau di bawah batas tersebut, sistem kami akan secara otomatis mengirimkan peringatan ke email atau nomor WhatsApp yang telah Anda daftarkan.'
    },
    {
      question: 'Bisakah Saya Mengakses Aplikasi Ini Dari HP?',
      answer: 'Ya. StockWatch dirancang untuk menjadi mobile-friendly. Anda bisa mengakses dashboard dan mengelola stok dari perangkat apa saja baik melalui HP, tablet, atau laptop selama terhubung ke internet.'
    },
    {
        question: 'Apakah Saya Bisa Upgrade atau Downgrade Paket Langganan Saya?',
        answer: 'Tentu. Anda bisa mengubah paket langganan Anda kapan saja melalui halaman profil di dashboard Anda. Perubahan akan berlaku pada siklus tagihan berikutnya.'
    }
  ];

  return (
    <div className="faq-page-container">
      <div className="faq-header">
        <h1>Frequently Asked Questions (FAQ)</h1>
        <p>Temukan jawaban untuk pertanyaan yang paling sering diajukan tentang StockWatch.</p>
      </div>
      <div className="accordion-container">
        {faqData.map((faq, index) => (
          <AccordionItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
}

export default FAQPage;