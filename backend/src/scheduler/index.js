import cron from 'node-cron';
import { checkStockAndSendNotifications } from '../services/notification.service.js';
import { checkAndDowngradePlans } from '../billing/billing.controller.js';
import { calculateAndStoreLeaderboards } from '../leaderboard/leaderboard.controller.js';

const initializeSchedulers = () => {
  cron.schedule('* * * * *', () => {
    console.log('Scheduler Notifikasi Stok berjalan...');
    checkStockAndSendNotifications();
  });

  cron.schedule('0 * * * *', () => {
    console.log('Scheduler Downgrade Paket berjalan...');
    checkAndDowngradePlans();
  });

  cron.schedule('5 0 * * *', () => {
    console.log('Scheduler Leaderboard Harian, Mingguan & Bulanan berjalan...');
    calculateAndStoreLeaderboards();
  }, {
    timezone: "Asia/Makassar"
  });

  console.log('Semua scheduler telah diinisialisasi.');
};

export default initializeSchedulers;