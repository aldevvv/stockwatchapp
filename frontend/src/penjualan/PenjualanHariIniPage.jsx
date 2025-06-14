import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getLaporanPenjualan } from './penjualanService';
import { showErrorToast, showInfoToast } from '../utils/toastHelper';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../styles/DashboardPages.css';
import './PenjualanHariIniPage.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
const formatDate = (timestamp, options = {}) => new Date(timestamp).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', ...options });

function InvoiceModal({ isOpen, onClose, invoiceData, user }) {
    if (!isOpen) return null;

    const handleDownloadInvoice = () => {
        const doc = new jsPDF();
        const pageW = doc.internal.pageSize.getWidth();
        const logoUrl = '/Logo.png';
        
        doc.addImage(logoUrl, 'PNG', 14, 15, 25, 0);
        doc.setFontSize(22); doc.setFont('helvetica', 'bold');
        doc.text("INVOICE", pageW - 20, 25, { align: 'right' });
        doc.setFontSize(10); doc.setFont('helvetica', 'normal');
        doc.text(`Invoice #${invoiceData.id.substring(0, 8)}`, pageW - 20, 32, { align: 'right' });

        doc.setLineWidth(0.5); doc.line(14, 45, pageW - 14, 45);

        doc.text(`Toko : ${user?.namaToko || 'StockWatch'}`, 14, 55);
        doc.text(`Tanggal : ${formatDate(invoiceData.tanggal, { day: '2-digit', month: 'long', year: 'numeric'})}`, 14, 61);

        autoTable(doc, {
            startY: 75,
            head: [['Nama Produk', 'Qty', 'Harga Satuan', 'Subtotal']],
            body: invoiceData.items.map(item => [item.namaProduk, item.qty, formatRupiah(item.hargaJual), formatRupiah(item.hargaJual * item.qty)]),
            theme: 'striped',
            headStyles: { fillColor: [34, 43, 62] },
        });

        const finalY = doc.lastAutoTable.finalY;
        doc.setFontSize(12);
        doc.text("Total", 140, finalY + 10, { align: 'right' });
        doc.setFont('helvetica', 'bold');
        doc.text(formatRupiah(invoiceData.totalPenjualan), 200, finalY + 10, { align: 'right' });

        doc.save(`Invoice-${invoiceData.id.substring(0, 8)}.pdf`);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="invoice-modal-content" onClick={e => e.stopPropagation()}>
                <div className="invoice-header">
                    <h3>Detail Invoice</h3>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="invoice-body">
                    <div className="invoice-toko-info">
                        <div>
                            <h4>{user?.namaToko || 'StockWatch'}</h4>
                            <p>INVOICE #{invoiceData.id.substring(0, 8)}</p>
                        </div>
                        <p>Tanggal : {formatDate(invoiceData.tanggal, { day: '2-digit', month: 'long', year: 'numeric'})}</p>
                    </div>
                    <table className="invoice-table">
                        <thead><tr><th>Produk</th><th>Kuantitas</th><th>Subtotal</th></tr></thead>
                        <tbody>
                            {invoiceData.items.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.namaProduk}</td>
                                    <td>{item.qty}</td>
                                    <td>{formatRupiah(item.hargaJual * item.qty)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="2">Total Penjualan</td>
                                <td>{formatRupiah(invoiceData.totalPenjualan)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div className="invoice-footer">
                    <button onClick={handleDownloadInvoice} className="button-add">Unduh Invoice (PDF)</button>
                </div>
            </div>
        </div>
    );
}

function PenjualanHariIniPage() {
    const { user } = useAuth();
    const [laporan, setLaporan] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

    const fetchLaporan = useCallback(async () => {
        setIsLoading(true);
        try {
            const now = new Date();
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
            const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

            const response = await getLaporanPenjualan({ 
                startDate: startOfDay.toISOString(), 
                endDate: endOfDay.toISOString() 
            });
            setLaporan(response.data.data);
        } catch (error) {
            showErrorToast("Gagal memuat laporan harian.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLaporan();
    }, [fetchLaporan]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchLaporan();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [fetchLaporan]);
    
    const handleOpenInvoice = (transaksi) => {
        setSelectedInvoice(transaksi);
        setIsInvoiceModalOpen(true);
    };

    const handleCloseInvoice = () => {
        setIsInvoiceModalOpen(false);
        setSelectedInvoice(null);
    };

    const lineChartData = {
        labels: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
        datasets: [{
            label: 'Total Penjualan per Jam',
            data: laporan?.trenPerJam || [],
            borderColor: '#16a34a',
            backgroundColor: 'rgba(22, 163, 74, 0.1)',
            fill: true, tension: 0.4, pointBackgroundColor: '#16a34a',
        }],
    };

    const handleDownloadLaporanHarian = () => {
        if (!laporan || laporan.kpi.jumlahTransaksi === 0) {
            showInfoToast("Tidak ada data penjualan hari ini untuk diunduh.");
            return;
        }
        const doc = new jsPDF();
        const pageW = doc.internal.pageSize.getWidth();
        const date = new Date();
        const dateStr = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
        const logoUrl = '/Logo.png';
        const logoWidth = 25;
        const logoX = (pageW / 2) - (logoWidth / 2);

        doc.addImage(logoUrl, 'PNG', logoX, 8, logoWidth, 0);
        doc.setFontSize(16); doc.setFont('helvetica', 'bold');
        doc.text("Laporan Penjualan Harian", pageW / 2, 30, { align: 'center' });
        doc.setFontSize(11); doc.setFont('helvetica', 'normal');
        doc.text(user?.namaToko || 'StockWatch', pageW / 2, 36, { align: 'center' });
        doc.setFontSize(9); doc.setTextColor(150);
        doc.text(`Tanggal Laporan : ${dateStr}`, pageW / 2, 41, { align: 'center' });
        doc.setLineWidth(0.5); doc.line(14, 48, pageW - 14, 48);

        autoTable(doc, {
            startY: 55,
            head: [['Ringkasan Penjualan', 'Jumlah']],
            body: [
                ['Total Penjualan :', formatRupiah(laporan.kpi.totalPenjualan)],
                ['Total Laba :', formatRupiah(laporan.kpi.totalLaba)],
                ['Jumlah Transaksi :', `${laporan.kpi.jumlahTransaksi} Transaksi`],
            ],
            theme: 'plain',
            styles: { fontSize: 10, cellPadding: 1 },
            columnStyles: {
                0: { fontStyle: 'bold', halign: 'left' },
                1: { halign: 'left' },
            }
        });

        const finalY = doc.lastAutoTable.finalY + 10;
        
        if (laporan.riwayatTransaksi.length > 0) {
            doc.setFontSize(12); doc.setTextColor(0, 0, 0); doc.setFont('helvetica', 'bold');
            doc.text('Detail Transaksi Hari Ini', 14, finalY);

            const tableColumns = ["Waktu", "Item Terjual", "Total Penjualan", "Laba"];
            const tableRows = [];
            laporan.riwayatTransaksi.forEach(tx => {
                tableRows.push([
                    formatDate(tx.tanggal),
                    tx.items.map(it => `${it.namaProduk} (x${it.qty})`).join(', '),
                    formatRupiah(tx.totalPenjualan),
                    formatRupiah(tx.laba)
                ]);
            });

            autoTable(doc, {
                head: [tableColumns],
                body: tableRows,
                startY: finalY + 7,
                theme: 'grid',
                headStyles: { fillColor: [22, 163, 74] },
                didDrawPage: (data) => {
                    const pageCount = doc.internal.getNumberOfPages();
                    if (pageCount > 1) {
                        doc.setFontSize(8);
                        doc.setTextColor(150);
                        doc.text(`Halaman ${data.pageNumber} dari ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
                    }
                }
            });
        }
        
        doc.save(`Laporan-Harian-${user?.namaToko?.replace(/\s/g, '-') || 'StockWatch'}-${new Date().toISOString().slice(0,10)}.pdf`);
    };

    if (isLoading) return <div className="page-container"><p>Memuat laporan...</p></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Penjualan Hari Ini</h2>
                <div className="header-actions">
                    <button onClick={handleDownloadLaporanHarian} className="button-secondary" disabled={isLoading || !laporan}>Unduh Laporan Harian</button>
                </div>
            </div>

            {laporan && (
                <>
                    <div className="kpi-cards-container report-kpi">
                        <div className="kpi-card"><h3>Total Penjualan</h3><p>{formatRupiah(laporan.kpi.totalPenjualan)}</p></div>
                        <div className="kpi-card safe"><h3>Total Laba</h3><p>{formatRupiah(laporan.kpi.totalLaba)}</p></div>
                        <div className="kpi-card"><h3>Jumlah Transaksi</h3><p>{laporan.kpi.jumlahTransaksi}</p></div>
                        <div className="kpi-card"><h3>Rata-rata / Transaksi</h3><p>{formatRupiah(laporan.kpi.rataRataTransaksi)}</p></div>
                    </div>
                    <div className="dashboard-grid">
                        <div className="dashboard-widget large-widget">
                            <h3 className="widget-title">Tren Penjualan per Jam</h3>
                            <div className="chart-wrapper"><Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
                        </div>
                        <div className="dashboard-widget full-width">
                             <h3 className="widget-title">Produk Terlaris Hari Ini</h3>
                             <div className="table-responsive">
                                <table className="data-table simple-table">
                                    <thead><tr><th>Produk</th><th>Terjual</th><th>Total Penjualan</th></tr></thead>
                                    <tbody>
                                        {laporan.produkTerlaris.length > 0 ? laporan.produkTerlaris.map((p,i) => (
                                            <tr key={i}><td>{p.namaProduk}</td><td>{p.terjual}</td><td>{formatRupiah(p.omzet)}</td></tr>
                                        )) : <tr><td colSpan="3" style={{textAlign:'center'}}>Belum ada produk terjual hari ini.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                         <div className="dashboard-widget full-width">
                            <h3 className="widget-title">Riwayat Transaksi Hari Ini</h3>
                            <div className="table-responsive">
                                <table className="data-table">
                                    <thead><tr><th>Waktu</th><th>Item Terjual</th><th>Total Penjualan</th><th>Aksi</th></tr></thead>
                                    <tbody>
                                        {laporan.riwayatTransaksi.length > 0 ? laporan.riwayatTransaksi.map(tx => (
                                            <tr key={tx.id}>
                                                <td>{formatDate(tx.tanggal)}</td>
                                                <td className="items-cell">{tx.items.map(it => `${it.namaProduk} (x${it.qty})`).join(', ')}</td>
                                                <td>{formatRupiah(tx.totalPenjualan)}</td>
                                                <td className="action-buttons"><button className="button-edit" onClick={() => handleOpenInvoice(tx)}>Invoice</button></td>
                                            </tr>
                                        )) : <tr><td colSpan="4" style={{textAlign:'center'}}>Belum ada transaksi hari ini.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <InvoiceModal isOpen={isInvoiceModalOpen} onClose={handleCloseInvoice} invoiceData={selectedInvoice} user={user} />
        </div>
    );
}

export default PenjualanHariIniPage;