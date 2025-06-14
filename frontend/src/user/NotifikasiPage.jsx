import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from './userService';
import { showSuccessToast, showErrorToast } from '../utils/toastHelper';
import '../styles/DashboardPages.css';
import './PengaturanPages.css';

function NotifikasiPage() {
    const { user, login: loginContext, token } = useAuth();
    const [preferences, setPreferences] = useState({
        preferensiNotifikasiEmail: true,
        preferensiNotifikasiWhatsApp: true,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setPreferences({
                preferensiNotifikasiEmail: user.hasOwnProperty('preferensiNotifikasiEmail') ? user.preferensiNotifikasiEmail : true,
                preferensiNotifikasiWhatsApp: user.hasOwnProperty('preferensiNotifikasiWhatsApp') ? user.preferensiNotifikasiWhatsApp : true,
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, checked } = e.target;
        setPreferences(prev => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await updateUserProfile(preferences);
            loginContext({ token, user: { ...user, ...response.data.data } });
            showSuccessToast('Preferensi notifikasi berhasil disimpan!');
        } catch (error) {
            showErrorToast('Gagal menyimpan preferensi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="pengaturan-card">
                <div className="pengaturan-card-header"><h3>Preferensi Notifikasi</h3></div>
                <div className="pengaturan-card-body">
                    <p>Pilih channel mana saja yang Anda inginkan untuk menerima notifikasi otomatis (seperti notifikasi stok rendah).</p>
                    <div className="form-group-checkbox">
                        <input type="checkbox" id="email" name="preferensiNotifikasiEmail" checked={preferences.preferensiNotifikasiEmail} onChange={handleChange} />
                        <label htmlFor="email">Terima Notifikasi via Email</label>
                    </div>
                    <div className="form-group-checkbox">
                        <input type="checkbox" id="whatsapp" name="preferensiNotifikasiWhatsApp" checked={preferences.preferensiNotifikasiWhatsApp} onChange={handleChange} />
                        <label htmlFor="whatsapp">Terima Notifikasi via WhatsApp</label>
                    </div>
                </div>
                <div className="pengaturan-card-footer">
                    <button type="submit" className="button-save-profile" disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : 'Simpan Preferensi'}</button>
                </div>
            </div>
        </form>
    );
}
export default NotifikasiPage;