import cron from 'node-cron';
import { checkStockAndSendNotifications } from '../services/notification.service.js';

console.log('Scheduler diinisialisasi.');

// Menjadwalkan tugas untuk berjalan setiap 2 menit untuk tujuan tes.
// Pola cron: (menit jam hari_bulan bulan hari_minggu)
// '*/2 * * * *' artinya 'jalankan setiap 2 menit'
// Nanti bisa diubah menjadi '0 * * * *' (setiap jam) atau '0 0 * * *' (setiap tengah malam)
cron.schedule('*/1 * * * *', () => {
  checkStockAndSendNotifications();
});