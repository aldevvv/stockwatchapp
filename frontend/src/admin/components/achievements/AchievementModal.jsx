import React, { useEffect } from 'react';
import './AchievementModal.css';

const BadgeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;

function AchievementModal({ achievement, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000); // Modal akan otomatis tertutup setelah 4 detik
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!achievement) return null;

    return (
        <div className="achievement-popup-overlay">
            <div className="achievement-popup-content">
                <BadgeIcon />
                <h3 className="achievement-title">Pencapaian Terbuka!</h3>
                <p className="achievement-name">{achievement.name}</p>
                <p className="achievement-description">{achievement.description}</p>
                <button onClick={onClose} className="achievement-close-btn">Tutup</button>
            </div>
        </div>
    );
}

export default AchievementModal;