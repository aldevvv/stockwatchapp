import React from 'react';
import { useAuth } from '../context/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './InvoiceModal.css';

const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
const formatDate = (timestamp) => new Date(timestamp).toLocaleString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

function InvoiceModal({ isOpen, onClose, invoiceData }) {
  const { user } = useAuth();
  if (!isOpen || !invoiceData) return null;

  const handleDownload = () => {
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();
    doc.addImage('/Logo.png', 'PNG', 14, 15, 25, 0);
    doc.setFontSize(22); doc.setFont('helvetica', 'bold');
    doc.text("INVOICE", pageW - 20, 25, { align: 'right' });
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    doc.text(`ID Transaksi : #${invoiceData.id.substring(0, 8)}`, pageW - 20, 32, { align: 'right' });
    doc.setLineWidth(0.5); doc.line(14, 45, pageW - 14, 45);
    doc.text(`Toko : ${user?.namaToko || 'StockWatch'}`, 14, 55);
    doc.text(`Tanggal : ${formatDate(invoiceData.tanggal)}`, 14, 61);

    autoTable(doc, {
        startY: 75,
        head: [['Deskripsi', 'Jumlah']],
        body: [[invoiceData.deskripsi, formatRupiah(invoiceData.jumlah)]],
        theme: 'striped',
        headStyles: { fillColor: [34, 43, 62] },
    });

    const finalY = doc.lastAutoTable.finalY;
    doc.setFontSize(12);
    doc.text("Total", 140, finalY + 15, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.text(formatRupiah(invoiceData.jumlah), 200, finalY + 15, { align: 'right' });
    doc.save(`Invoice-${invoiceData.id.substring(0, 8)}.pdf`);
  };

  return (
    <div className="modal-overlay-billing" onClick={onClose}>
      <div className="modal-content-billing" onClick={e => e.stopPropagation()}>
        <div className="invoice-header">
          <h3>Detail Transaksi Saldo</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="invoice-body">
          <div className="invoice-toko-info">
            <div>
              <h4>{user?.namaToko || 'StockWatch'}</h4>
              <p>ID Transaksi : #{invoiceData.id.substring(0, 8)}</p>
            </div>
            <p>Tanggal : {formatDate(invoiceData.tanggal)}</p>
          </div>
          <table className="invoice-table">
            <thead><tr><th>Deskripsi</th><th>Jumlah</th></tr></thead>
            <tbody>
                <tr>
                    <td>{invoiceData.deskripsi}</td>
                    <td>{formatRupiah(invoiceData.jumlah)}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td>Total</td>
                    <td>{formatRupiah(invoiceData.jumlah)}</td>
                </tr>
            </tfoot>
          </table>
        </div>
        <div className="invoice-footer">
          <button onClick={handleDownload} className="button-add">Unduh Invoice (PDF)</button>
        </div>
      </div>
    </div>
  );
}

export default InvoiceModal;