import React from 'react';
import { Link } from 'react-router-dom';
import './PricingPage.css';

function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: 'Rp 0',
      period: '/ selamanya',
      description: 'Cocok untuk memulai dan mencoba fitur dasar StockWatch.',
      features: [
        '7 Stok',
        '5 Supplier',
        '5 Produk',
        'Notifikasi via Email',
        'Fitur StockShare',
      ],
      ctaText: 'Mulai Gratis',
      ctaLink: '/register',
      isPopular: false,
    },
    {
      name: 'Basic',
      price: 'Rp 10.000',
      period: '/ bulan',
      description: 'Untuk UMKM yang mulai berkembang dan butuh kontrol lebih.',
      features: [
        '25 Stok',
        '25 Supplier',
        '25 Produk',
        'Notifikasi via Whatsapp & Email',
        'Dukungan Komunitas',
      ],
      ctaText: 'Pilih Paket Basic',
      ctaLink: '/register',
      isPopular: false,
    },
    {
      name: 'Pro',
      price: 'Rp 25.000',
      period: '/ bulan',
      description: 'Solusi lengkap untuk efisiensi maksimal dan pertumbuhan bisnis.',
      features: [
        'Semua di Paket Basic',
        'Unlimited Stok',
        'Unlimited Supplier',
        'Unlimited Produk',
        'Notifikasi via Whatsapp & Email',
        'Dukungan Prioritas',
      ],
      ctaText: 'Pilih Paket Pro',
      ctaLink: '/register',
      isPopular: true,
    },
    {
      name: 'Enterprise',
      price: 'Kustom',
      period: '',
      description: 'Untuk bisnis skala besar dengan kebutuhan spesifik dan kustom.',
      features: [
        'Semua di Paket Pro',
        'Pengguna Tanpa Batas',
        'Integrasi API Kustom',
        'Analitik Prediktif',
        'Manajer Akun Khusus',
        'Dukungan SLA',
        'Fitur Kustom',
      ],
      ctaText: 'Hubungi Kami',
      ctaLink: '/contact',
      isPopular: false,
    },
  ];

  return (
    <div className="pricing-page-container">
      <div className="pricing-header">
        <h1>Paket Harga yang Fleksibel</h1>
        <p>Pilih paket yang paling sesuai dengan skala dan kebutuhan bisnis Anda. Mulai gratis, upgrade kapan saja.</p>
      </div>

      <div className="pricing-grid">
        {plans.map((plan, index) => (
          <div key={index} className={`pricing-card ${plan.isPopular ? 'popular' : ''}`}>
            {plan.isPopular && <div className="badge-popular">Paling Populer</div>}
            <div className="card-header">
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">
                {plan.price}
                {plan.period && <span className="plan-period">{plan.period}</span>}
              </div>
              <p className="plan-description">{plan.description}</p>
            </div>
            <div className="card-body">
              <ul className="feature-list">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="feature-item">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-footer">
              <Link to={plan.ctaLink} className="btn-cta">
                {plan.ctaText}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PricingPage;