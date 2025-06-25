import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getAchievementsStatus } from './achievementService';
import { showErrorToast } from '../../../utils/toastHelper';
import '../../../styles/DashboardPages.css';
import './AchievementsPage.css';

const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const AwardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 17 17 23 15.79 13.88"></polyline></svg>;


function AchievementCard({ achievement }) {
    const { name, description, isUnlocked, unlockedAt } = achievement;
    const unlockedDate = unlockedAt ? new Date(unlockedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : null;

    return (
        <div className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
            <div className="achievement-icon">
                {isUnlocked ? <AwardIcon /> : <LockIcon />}
            </div>
            <div className="achievement-details">
                <h3 className="achievement-name">{name}</h3>
                <p className="achievement-description">{description}</p>
                {isUnlocked && <small className="achievement-date">Didapatkan pada tanggal {unlockedDate}</small>}
            </div>
        </div>
    );
}


function AchievementsPage() {
    const [achievements, setAchievements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getAchievementsStatus();
            setAchievements(response.data.data || []);
        } catch (error) {
            showErrorToast("Gagal memuat data pencapaian.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const { unlockedAchievements, lockedAchievements } = useMemo(() => {
        return achievements.reduce((acc, ach) => {
            if (ach.isUnlocked) {
                acc.unlockedAchievements.push(ach);
            } else {
                acc.lockedAchievements.push(ach);
            }
            return acc;
        }, { unlockedAchievements: [], lockedAchievements: [] });
    }, [achievements]);

    if (isLoading) {
        return <div className="page-container"><p>Memuat pencapaian...</p></div>;
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Pencapaian Saya</h2>
            </div>

            <div className="achievements-section">
                <h3 className="section-title">Lencana Terbuka ({unlockedAchievements.length})</h3>
                {unlockedAchievements.length > 0 ? (
                    <div className="achievements-grid">
                        {unlockedAchievements.map(ach => <AchievementCard key={ach.id} achievement={ach} />)}
                    </div>
                ) : (
                    <p>Anda belum membuka lencana apapun. Terus gunakan aplikasi untuk mendapatkannya!</p>
                )}
            </div>

            <div className="achievements-section">
                <h3 className="section-title">Lencana Terkunci ({lockedAchievements.length})</h3>
                <div className="achievements-grid">
                    {lockedAchievements.map(ach => <AchievementCard key={ach.id} achievement={ach} />)}
                </div>
            </div>
        </div>
    );
}

export default AchievementsPage;