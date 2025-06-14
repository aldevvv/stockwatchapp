import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { upgradePlan, getPlanDetails } from './billingService';
import { showErrorToast, showSuccessToast } from '../utils/toastHelper';
import '../styles/DashboardPages.css';
import './UpgradePlanPage.css';

const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);

function UpgradePlanPage() {
    const { planName } = useParams();
    const { user, refreshUserData } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [planDetails, setPlanDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPlanDetails = async () => {
            setIsLoading(true);
            try {
                const response = await getPlanDetails();
                setPlanDetails(response.data.data);
            } catch (error) {
                showErrorToast('Gagal memuat detail paket.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPlanDetails();
    }, []);

    if (isLoading || !planDetails) {
        return <div className="page-container"><p>Memuat detail paket...</p></div>;
    }

    const price = planDetails[planName]?.price || 0;
    const userSaldo = user?.saldo || 0;
    const isSaldoCukup = userSaldo >= price;

    const handleUpgrade = async () => {
        if (!isSaldoCukup) {
            showErrorToast("Saldo Anda tidak cukup untuk melakukan upgrade ini.");
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await upgradePlan(planName);
            showSuccessToast(response.data.message);
            await refreshUserData();
            navigate('/upgrade-sukses', { state: { invoiceData: response.data.data, planName: planName } });
        } catch (error) {
            showErrorToast(error.response?.data?.message || "Gagal melakukan upgrade.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-container upgrade-page-bg">
            <div className="upgrade-card">
                <div className="upgrade-card-header">
                    <h3>Konfirmasi Upgrade Paket</h3>
                    <p>Anda akan melakukan upgrade ke paket <strong>{planName}</strong>. Mohon periksa kembali detail di bawah ini sebelum melanjutkan.</p>
                </div>
                <div className="upgrade-card-body">
                    <div className="summary-details">
                        <div className="summary-item">
                            <span>Harga Paket {planName}</span>
                            <span>{formatRupiah(price)}</span>
                        </div>
                        <div className="summary-item">
                            <span>Saldo Anda Saat Ini</span>
                            <span>{formatRupiah(userSaldo)}</span>
                        </div>
                        <hr className="summary-divider"/>
                        <div className={`summary-item final-amount ${!isSaldoCukup ? 'insufficient' : ''}`}>
                            <span>Sisa Saldo Setelah Upgrade</span>
                            <span>{formatRupiah(userSaldo - price)}</span>
                        </div>
                    </div>
                    {!isSaldoCukup && 
                        <div className="insufficient-note">
                            <p><strong>Saldo Tidak Cukup!</strong></p>
                            <p>Saldo Anda tidak mencukupi untuk melakukan upgrade ini. Silakan lakukan Top Up terlebih dahulu.</p>
                        </div>
                    }
                </div>
                <div className="upgrade-card-footer">
                    <button onClick={() => navigate('/semua-plan')} className="button-cancel">Batal</button>
                    <button onClick={handleUpgrade} className="button-confirm-upgrade" disabled={!isSaldoCukup || isSubmitting}>
                        {isSubmitting ? 'Memproses...' : 'Konfirmasi & Upgrade Sekarang'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UpgradePlanPage;