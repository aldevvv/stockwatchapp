import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import jsPDF from 'jspdf';
import autoTable from'jspdf-autotable';
import './UpgradeSuccessPage.css';

const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
const formatDate = (timestamp) => new Date(timestamp).toLocaleString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

function UpgradeSuccessPage() {
    const location = useLocation();
    const { user } = useAuth();
    const { invoiceData, planName } = location.state || {};

    if (!invoiceData) {
        return <div className="invoice-container"><p>Data transaksi tidak ditemukan.</p></div>;
    }

    const handleDownloadPdf = () => {
        const doc = new jsPDF();
        doc.setFontSize(18); doc.text("Bukti Pembayaran Upgrade Paket", 14, 22);
        doc.setFontSize(11);
        doc.text(`ID Transaksi : ${invoiceData.id}`, 14, 32);
        doc.text(`Tanggal : ${formatDate(invoiceData.tanggal)}`, 14, 38);
        doc.text(`Toko : ${user?.namaToko || ''}`, 14, 44);

        autoTable(doc, {
            startY: 55,
            head: [['Deskripsi', 'Jumlah']],
            body: [
                [`Upgrade ke Paket ${planName}`, formatRupiah(invoiceData.jumlah)],
            ],
            foot: [[{ content: 'Total', styles: { halign: 'right' } }, formatRupiah(invoiceData.jumlah)]],
            theme: 'striped',
            headStyles: { fillColor: [22, 163, 74] }
        });
        doc.save(`invoice-upgrade-${invoiceData.id.substring(0,6)}.pdf`);
    };

    return (
        <div className="invoice-container">
            <div className="invoice-box">
                <div className="invoice-header success">
                    <span className="icon-success">✓</span>
                    <h2>Upgrade Berhasil!</h2>
                    <p>Anda Sekarang Berada di Paket {planName}.</p>
                </div>
                <div className="invoice-body">
                    <h3>Detail Transaksi</h3>
                    <div className="detail-row"><span>ID Transaksi :</span><span>{invoiceData.id}</span></div>
                    <div className="detail-row"><span>Tanggal :</span><span>{formatDate(invoiceData.tanggal)}</span></div>
                    <div className="detail-row"><span>Deskripsi :</span><span>{invoiceData.deskripsi}</span></div>
                    <div className="detail-row total"><span>Total Pembayaran :</span><span>{formatRupiah(invoiceData.jumlah)}</span></div>
                </div>
                <div className="invoice-footer">
                    <button onClick={handleDownloadPdf} className="button-secondary">Unduh Invoice (PDF)</button>
                    <Link to="/billing" className="button-add">Kembali ke Halaman Billing</Link>
                </div>
            </div>
        </div>
    );
}

export default UpgradeSuccessPage;