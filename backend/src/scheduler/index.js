import cron from 'node-cron';
import { checkStockAndSendNotifications } from '../services/notification.service.js';
import { checkAndDowngradePlans } from '../billing/billing.controller.js';

const initializeSchedulers = () => {
  cron.schedule('* * * * *', () => {
    console.log('Menjalankan scheduler notifikasi stok...');
    checkStockAndSendNotifications();
  });

  cron.schedule('0 * * * *', () => {
    console.log('Menjalankan scheduler downgrade paket...');
    checkAndDowngradePlans();
  });

  console.log('Semua scheduler telah diinisialisasi.');
};

export default initializeSchedulers;