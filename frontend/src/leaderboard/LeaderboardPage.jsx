import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getLeaderboard, recalculateLeaderboard } from './leaderboardService';
import { showErrorToast, showSuccessToast } from '../utils/toastHelper';
import '../styles/DashboardPages.css';
import './LeaderboardPage.css';

const TrophyIcon = ({ color }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={color} stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><line x1="10" y1="14.5" x2="14" y2="14.5"></line><line x1="12" y1="22" x2="12" y2="14.5"></line><path d="M15.5 14.5A3.5 3.5 0 0 0 19 11V9H5v2a3.5 3.5 0 0 0 3.5 3.5"></path></svg>;
const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);

function LeaderboardPage() {
    const { user } = useAuth();
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRecalculating, setIsRecalculating] = useState(false);
    const [activeType, setActiveType] = useState('transactionCount');

    const fetchLeaderboard = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getLeaderboard(activeType);
            setLeaderboard(response.data.data || []);
        } catch (error) {
            showErrorToast('Gagal memuat data leaderboard.');
            setLeaderboard([]);
        } finally {
            setIsLoading(false);
        }
    }, [activeType]);

    useEffect(() => {
        fetchLeaderboard();
    }, [fetchLeaderboard]);
    
    const handleRecalculate = async () => {
        setIsRecalculating(true);
        try {
            await recalculateLeaderboard();
            showSuccessToast("Peringkat sedang diperbarui, memuat ulang data dalam 2 detik...");
            setTimeout(fetchLeaderboard, 2000);
        } catch (error) {
            showErrorToast("Gagal memicu perhitungan ulang.");
        } finally {
            setIsRecalculating(false);
        }
    };

    const getRankIcon = (rank) => {
        if (rank === 0) return <TrophyIcon color="#FFD700" />;
        if (rank === 1) return <TrophyIcon color="#C0C0C0" />;
        if (rank === 2) return <TrophyIcon color="#CD7F32" />;
        return <span className="rank-number">{rank + 1}</span>;
    };

    const myRankData = leaderboard.find(item => item.userId === user.id);
    const myRankIndex = leaderboard.findIndex(item => item.userId === user.id);

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Papan Peringkat (Semua Waktu)</h2>
                <button className="button-secondary" onClick={handleRecalculate} disabled={isRecalculating}>
                    {isRecalculating ? 'Menghitung Ulang...' : 'Perbarui Peringkat'}
                </button>
            </div>
            
            <div className="leaderboard-controls">
                <div className="leaderboard-tabs">
                    <button className={`tab-button ${activeType === 'transactionCount' ? 'active' : ''}`} onClick={() => setActiveType('transactionCount')}>Transaksi Terbanyak</button>
                    <button className={`tab-button ${activeType === 'totalProfit' ? 'active' : ''}`} onClick={() => setActiveType('totalProfit')}>Laba Tertinggi</button>
                    <button className={`tab-button ${activeType === 'totalSaldo' ? 'active' : ''}`} onClick={() => setActiveType('totalSaldo')}>Saldo Tertinggi</button>
                </div>
            </div>

            <div className="leaderboard-container">
                {isLoading ? <p>Memuat peringkat...</p> : leaderboard.length > 0 ? (
                    leaderboard.map((player, index) => (
                        <div key={player.userId} className={`rank-item ${index < 3 ? `top-${index + 1}` : ''}`}>
                            <div className="rank-position">{getRankIcon(index)}</div>
                            <img src={player.fotoProfilUrl || 'https://i.ibb.co/hK3aT2v/default-avatar.png'} alt={player.namaToko} className="rank-avatar" />
                            <div className="rank-details">
                                <div className="rank-name-container">
                                    <span className="rank-user-name">{player.namaLengkap}</span>
                                    <span className="rank-store-badge">{player.namaToko}</span>
                                </div>
                                <span className="rank-score">
                                    {activeType === 'transactionCount' ? `${player.transactionCount} Transaksi` : 
                                     activeType === 'totalProfit' ? formatRupiah(player.totalProfit) : 
                                     formatRupiah(player.totalSaldo)}
                                </span>
                            </div>
                        </div>
                    ))
                ) : <p>Belum ada data untuk leaderboard ini.</p>}
            </div>

            {myRankData && (
                 <div className="my-rank-card">
                    <div className="rank-item mine">
                        <div className="rank-position">{getRankIcon(myRankIndex)}</div>
                        <img src={myRankData.fotoProfilUrl || 'https://i.ibb.co/hK3aT2v/default-avatar.png'} alt={myRankData.namaToko} className="rank-avatar" />
                        <div className="rank-details">
                             <div className="rank-name-container">
                                <span className="rank-user-name">{myRankData.namaLengkap} (Anda)</span>
                                <span className="rank-store-badge">{myRankData.namaToko}</span>
                            </div>
                            <span className="rank-score">
                                {activeType === 'transactionCount' ? `${myRankData.transactionCount} Transaksi` : 
                                 activeType === 'totalProfit' ? formatRupiah(myRankData.totalProfit) :
                                 formatRupiah(myRankData.totalSaldo)}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LeaderboardPage;