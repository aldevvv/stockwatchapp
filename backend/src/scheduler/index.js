import cron from 'node-cron';
import { checkStockAndSendNotifications } from '../services/notification.service.js';
import { checkAndDowngradePlans } from '../billing/billing.controller.js';
import { calculateAndStoreLeaderboards } from '../leaderboard/leaderboard.controller.js';

const initializeSchedulers = () => {
  console.log('[Scheduler] Inisialisasi dimulai...');

  // Notifikasi Stok: tiap menit
  cron.schedule('* * * * *', async () => {
    console.log('[Scheduler] Notifikasi Stok berjalan...');
    try {
      await checkStockAndSendNotifications();
      console.log('[Scheduler] Notifikasi Stok selesai tanpa error.');
    } catch (error) {
      console.error('[Scheduler Error] Notifikasi Stok:', error);
    }
  });

  // Downgrade Paket: tiap jam
  cron.schedule('0 * * * *', async () => {
    console.log('[Scheduler] Downgrade Paket berjalan...');
    try {
      await checkAndDowngradePlans();
      console.log('[Scheduler] Downgrade Paket selesai tanpa error.');
    } catch (error) {
      console.error('[Scheduler Error] Downgrade Paket:', error);
    }
  });

  // Leaderboard: tiap hari pukul 00:05 waktu Makassar
  cron.schedule('5 0 * * *', async () => {
    console.log('[Scheduler] Leaderboard Harian, Mingguan & Bulanan berjalan...');
    try {
      await calculateAndStoreLeaderboards();
      console.log('[Scheduler] Leaderboard selesai tanpa error.');
    } catch (error) {
      console.error('[Scheduler Error] Leaderboard:', error);
    }
  }, {
    timezone: "Asia/Makassar"
  });

  console.log('[Scheduler] Semua scheduler telah diinisialisasi.');
};

export default initializeSchedulers;
