import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/DashboardPages.css';
import './SemuaPlanPage.css';

function SemuaPlanPage() {
    const { user } = useAuth();

    const planHierarchy = { 'Free': 0, 'Basic': 1, 'Pro': 2, 'Enterprise': 3 };
    const currentUserPlanLevel = user ? planHierarchy[user.plan] : 0;

    const plans = [
        { name: 'Free', price: 'Rp 0', period: '/ selamanya', description: 'Untuk memulai dan mencoba fitur dasar.', features: ['10 Stok', '10 Produk', '5 Supplier', 'Notifikasi via Email', 'Fitur StockShare'], ctaLink: '#', level: 0 },
        { name: 'Basic', price: 'Rp 10.000', period: '/ bulan', description: 'Untuk UMKM yang mulai berkembang.', features: ['Semua Fitur Free', '75 Stok', '75 Produk', '50 Supplier', 'Notifikasi WhatsApp & Email'], ctaLink: '/upgrade-plan/Basic', level: 1 },
        { name: 'Pro', price: 'Rp 25.000', period: '/ bulan', description: 'Solusi lengkap untuk efisiensi maksimal.', features: ['Semua Fitur Basic','Unlimited Stok', 'Unlimited Supplier', 'Unlimited Produk', 'Notifikasi Whatsapp & Email', 'Dukungan Prioritas'], ctaLink: '/upgrade-plan/Pro', isPopular: true, level: 2 },
        { name: 'Enterprise', price: 'Kustom', period: '', description: 'Untuk bisnis skala besar dengan kebutuhan spesifik.', features: ['Semua Fitur Pro', 'Integrasi API', 'Dukungan SLA Penuh', 'Fitur Kustom'], ctaLink: '/stock-dashboard', level: 3 },
    ];

    const getButtonState = (plan) => {
        if (currentUserPlanLevel === plan.level) {
            return { text: 'Paket Anda Saat Ini', disabled: true };
        }
        if (currentUserPlanLevel > plan.level) {
            return { text: 'Downgrade Tidak Didukung', disabled: true };
        }
        return { text: `Upgrade ke ${plan.name}`, disabled: false };
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Pilih Paket yang Tepat untuk Bisnis Anda</h2>
                <p>Mulai gratis dan upgrade kapan saja saat bisnis Anda berkembang.</p>
            </div>
            <div className="semua-plan-grid">
                {plans.map((plan, index) => {
                    const buttonState = getButtonState(plan);
                    return (
                        <div key={index} className={`pricing-card ${plan.isPopular ? 'popular' : ''} ${buttonState.disabled ? 'current' : ''}`}>
                            {plan.isPopular && <div className="badge-popular">Paling Populer</div>}
                            <div className="pricing-card-header">
                                <h3>{plan.name}</h3>
                                <p className="plan-price">{plan.price} <span className="plan-period">{plan.period}</span></p>
                                <p className="plan-description">{plan.description}</p>
                            </div>
                            <div className="pricing-card-body">
                                <ul className="feature-list">
                                    {plan.features.map((feature, fIndex) => (
                                    <li key={fIndex}>{feature}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="pricing-card-footer">
                                <Link to={plan.ctaLink || '#'} className={`button-upgrade-plan ${buttonState.disabled ? 'disabled-btn' : ''}`} style={buttonState.disabled ? {pointerEvents: 'none'} : {}}>
                                    {buttonState.text}
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default SemuaPlanPage;