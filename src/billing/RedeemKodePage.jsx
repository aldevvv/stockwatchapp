import React, { useState } from 'react';
import { redeemCode } from './billingService';
import { useAuth } from '../context/AuthContext';
import { showSuccessToast, showErrorToast } from '../utils/toastHelper';
import '../styles/DashboardPages.css';
import './RedeemKodePage.css';

function RedeemKodePage() {
    const { refreshUserData } = useAuth();
    const [kode, setKode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!kode) {
            showErrorToast('Silakan masukkan kode voucher.');
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await redeemCode(kode);
            showSuccessToast(response.data.message);
            await refreshUserData();
            setKode('');
        } catch (error) {
            showErrorToast(error.response?.data?.message || 'Gagal menggunakan kode.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Redeem Kode Voucher</h2>
            </div>
            <div className="redeem-card">
                <form onSubmit={handleSubmit} className="redeem-form">
                    <label htmlFor="kode">Masukkan Kode Voucher</label>
                    <input 
                        type="text" 
                        id="kode"
                        value={kode}
                        onChange={(e) => setKode(e.target.value)}
                        placeholder="Contoh: STOCKWATCHPROMO"
                    />
                    <button type="submit" className="button-add" disabled={isSubmitting}>
                        {isSubmitting ? 'Memproses...' : 'Gunakan Kode'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RedeemKodePage;