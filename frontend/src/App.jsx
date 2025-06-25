import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AchievementProvider } from './context/AchievementContext';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ScrollToTop from './components/ScrollToTop'; 

import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminLayout from './admin/components/layout/AdminLayout';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PricingPage from './pages/PricingPage';
import TestimonialsPage from './pages/TestimonialsPage';
import PricingInfoPage from './pages/PricingInfoPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import BillingPage from './billing/BillingPage'; 
import RedeemKodePage from './billing/RedeemKodePage';
import SemuaPlanPage from './billing/SemuaPlanPage';
import UpgradePlanPage from './billing/UpgradePlanPage';

import LoginPage from './auth/LoginPage';
import RegisterPage from './auth/RegisterPage';
import VerifyEmailPage from './auth/VerifyEmailPage';
import RequestPasswordResetPage from './auth/RequestPasswordResetPage';
import ResetPasswordPage from './auth/ResetPasswordPage';

import StockListPage from './stok/StockListPage';
import StockHistoryPage from './history/StockHistoryPage';
import SupplierListPage from './supplier/SupplierListPage';
import StockDashboardPage from './dashboard/StockDashboardPage';
import ProdukPage from './produk/ProdukPage';
import PosPage from './penjualan/PosPage';
import PenjualanHariIniPage from './penjualan/PenjualanHariIniPage';
import RiwayatPenjualanPage from './penjualan/RiwayatPenjualanPage';
import StockMarketPage from './stockshare/StockMarketPage';
import DaftarListingPage from './stockshare/DaftarListingPage';
import UpgradeSuccessPage from './billing/UpgradeSuccessPage';
import AchievementsPage from './admin/components/achievements/AchievementsPage';
import LeaderboardPage from './leaderboard/LeaderboardPage';


import PengaturanAkunPage from './user/PengaturanAkunPage';
import NotifikasiPage from './user/NotifikasiPage';
import DeaktivasiPage from './user/DeaktivasiPage';

import AdminDashboardPage from './admin/AdminDashboardPage';
import AdminManajemenPengguna from './admin/AdminManajemenPengguna';
import AdminManajemenKodePage from './admin/AdminManajemenKodePage';
import AdminTambahSaldoPage from './admin/AdminTambahSaldoPage';
import AdminEditUserPage from './admin/AdminEditUserPage';

import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './admin/components/AdminProtectedRoute';

function AppContent() {
    const { token, user, isLoadingUser } = useAuth();

    if (isLoadingUser && token) {
        return <p style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2rem' }}>Memuat sesi pengguna...</p>;
    }

    return (
        <AchievementProvider>
            <BrowserRouter>
                <ScrollToTop />
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
                <Routes>
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/pricing" element={<PricingPage />} />
                        <Route path="/pricing-info" element={<PricingInfoPage />} />
                        <Route path="/testimonials" element={<TestimonialsPage />} />
                        <Route path="/faq" element={<FAQPage />} />
                        <Route path="/contactus" element={<ContactPage />} />
                        <Route path="/terms" element={<TermsPage />} />
                        <Route path="/privacypolicy" element={<PrivacyPolicyPage />} />
                        <Route path="/login" element={token && user?.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> : (token && user?.role !== 'admin' ? <Navigate to="/stock-dashboard" replace /> : <LoginPage />)} />
                        <Route path="/register" element={token ? (user?.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/stock-dashboard" replace />) : <RegisterPage />} />
                        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
                        <Route path="/request-password-reset" element={token ? (user?.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/stock-dashboard" replace />) : <RequestPasswordResetPage />} />
                        <Route path="/reset-password/:token" element={token ? (user?.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/stock-dashboard" replace />) : <ResetPasswordPage />} />
                    </Route>
                    
                    <Route 
                        element={
                            <ProtectedRoute>
                                <DashboardLayout /> 
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/stock-dashboard" element={<StockDashboardPage />} />
                        <Route path="/stock-list" element={<StockListPage />} />
                        <Route path="/stock-history" element={<StockHistoryPage />} />
                        <Route path="/supplier-list" element={<SupplierListPage />} />
                        <Route path="/produk" element={<ProdukPage />} />
                        <Route path="/kasir" element={<PosPage />} />
                        <Route path="/penjualan/hari-ini" element={<PenjualanHariIniPage />} />
                        <Route path="/penjualan/riwayat" element={<RiwayatPenjualanPage />} />
                        <Route path="/akun" element={<PengaturanAkunPage />} />
                        <Route path="/notifikasi" element={<NotifikasiPage />} />
                        <Route path="/deaktivasi" element={<DeaktivasiPage />} />
                        <Route path="/stock-market" element={<StockMarketPage />} />
                        <Route path="/daftar-listing" element={<DaftarListingPage />} />
                        <Route path="/billing" element={<BillingPage />} />
                        <Route path="/semua-plan" element={<SemuaPlanPage />} />
                        <Route path="/redeem-kode" element={<RedeemKodePage />} />
                        <Route path="/upgrade-plan/:planName" element={<UpgradePlanPage />} />
                        <Route path="/upgrade-sukses" element={<UpgradeSuccessPage />} />
                        <Route path="/achievements" element={<AchievementsPage />} />
                        <Route path="/leaderboard" element={<LeaderboardPage />} />


                    </Route>

                    <Route
                        element={
                            <AdminProtectedRoute>
                                <AdminLayout />
                            </AdminProtectedRoute>
                        }
                    >
                        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                        <Route path="/admin/manajemen-pengguna" element={<AdminManajemenPengguna />} />
                        <Route path="/admin/kode-redeem" element={<AdminManajemenKodePage />} />
                        <Route path="/admin/tambah-saldo" element={<AdminTambahSaldoPage />} />
                        <Route path="/admin/edit-pengguna" element={<AdminEditUserPage />} />
                    </Route>

                    <Route path="*" element={<Navigate to={token ? (user?.role === 'admin' ? "/admin/dashboard" : "/stock-dashboard") : "/"} replace />} />
                </Routes>
            </BrowserRouter>
        </AchievementProvider>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;