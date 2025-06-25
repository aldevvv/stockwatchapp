import db from '../config/firebase.js';
import { sendEmailNotification, generateEmailTemplate } from '../services/notification.service.js';
import { PLAN_LIMITS as planLimitsConfig } from '../config/planLimits.js';
import { checkAndAwardAchievements } from '../achievements/achievement.service.js';

export const redeemCode = async (req, res) => {
    const { kode } = req.body;
    const userId = req.user.id;
    if (!kode) {
        return res.status(400).json({ message: "Kode voucher wajib diisi." });
    }
    const kodeRef = db.ref(`redeemCodes/${kode}`);
    const kodeSnapshot = await kodeRef.once('value');
    if (!kodeSnapshot.exists()) {
        return res.status(404).json({ message: "Kode voucher tidak valid atau tidak ditemukan." });
    }
    const kodeData = kodeSnapshot.val();
    if (!kodeData.isActive || kodeData.redeemCount >= kodeData.limit) {
        return res.status(400).json({ message: "Kode voucher tidak valid atau sudah habis." });
    }
    const userProfileRef = db.ref(`users/${userId}/profile`);
    const userSnapshot = await userProfileRef.once('value');
    const userProfile = userSnapshot.val();
    const saldoSekarang = userProfile.saldo || 0;
    const nilaiVoucher = Number(kodeData.value);
    const saldoBaru = saldoSekarang + nilaiVoucher;
    const historyRef = db.ref(`saldoHistory/${userId}`).push();
    const historyData = {
        id: historyRef.key,
        tanggal: Date.now(),
        deskripsi: `Redeem kode: ${kode}`,
        jumlah: nilaiVoucher,
        tipe: 'debit'
    };
    const updates = {};
    updates[`users/${userId}/profile/saldo`] = saldoBaru;
    updates[`redeemCodes/${kode}/redeemCount`] = (kodeData.redeemCount || 0) + 1;
    updates[`redeemCodes/${kode}/users/${userId}`] = true;
    updates[`saldoHistory/${userId}/${historyRef.key}`] = historyData;
    await db.ref().update(updates);
    const unlockedAchievements = await checkAndAwardAchievements(userId, 'REDEEM_COUNT');
    res.status(200).json({ message: `Berhasil! Saldo sebesar Rp ${nilaiVoucher.toLocaleString('id-ID')} telah ditambahkan.`, unlockedAchievements });
};

export const getSaldoHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const historyRef = db.ref(`saldoHistory/${userId}`).orderByChild('tanggal');
        const snapshot = await historyRef.once('value');
        if (!snapshot.exists()) {
            return res.status(200).json({ data: [] });
        }
        res.status(200).json({ data: Object.values(snapshot.val()).reverse() });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil riwayat saldo." });
    }
};

export const upgradePlan = async (req, res) => {
    const { targetPlan } = req.body;
    const userId = req.user.id;
    const planDetails = planLimitsConfig[targetPlan];
    if (!planDetails) {
        return res.status(400).json({ message: "Paket tidak valid." });
    }
    const profileRef = db.ref(`users/${userId}/profile`);
    const profileSnapshot = await profileRef.once('value');
    const userProfile = profileSnapshot.val();
    const currentSaldo = userProfile.saldo || 0;
    if (currentSaldo < planDetails.price) {
        return res.status(400).json({ message: "Saldo tidak cukup." });
    }
    const newSaldo = currentSaldo - planDetails.price;
    const expiryTimestamp = Date.now() + (planDetails.durationDays * 24 * 60 * 60 * 1000);
    const historyRef = db.ref(`saldoHistory/${userId}`).push();
    const historyData = {
        id: historyRef.key,
        tanggal: Date.now(),
        deskripsi: `Upgrade ke paket ${targetPlan}`,
        jumlah: -planDetails.price,
        tipe: 'expense'
    };
    const updates = {};
    updates[`users/${userId}/profile/saldo`] = newSaldo;
    updates[`users/${userId}/profile/plan`] = targetPlan;
    updates[`users/${userId}/profile/planExpiry`] = expiryTimestamp;
    updates[`saldoHistory/${userId}/${historyRef.key}`] = historyData;
    await db.ref().update(updates);
    const unlockedAchievements = await checkAndAwardAchievements(userId, 'PLAN_UPGRADE');
    res.status(200).json({
        message: `Upgrade ke paket ${targetPlan} berhasil!`,
        data: historyData,
        unlockedAchievements
    });
};

export const getPlanDetails = async (req, res) => {
    try {
        res.status(200).json({ data: planLimitsConfig });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil detail plan." });
    }
};

export const checkAndDowngradePlans = async () => {
    console.log('Scheduler berjalan: Memeriksa paket kedaluwarsa...');
    const now = Date.now();
    const usersRef = db.ref('users');
    try {
        const snapshot = await usersRef.once('value');
        const users = snapshot.val();
        if (!users) return;
        for (const userId in users) {
            const userProfile = users[userId]?.profile;
            if (userProfile && userProfile.plan !== 'Free' && userProfile.planExpiry && userProfile.planExpiry < now) {
                const profileRef = db.ref(`users/${userId}/profile`);
                await profileRef.update({
                    plan: 'Free',
                    planExpiry: null
                });
                const emailSubject = 'Paket Langganan StockWatch Anda Telah Berakhir';
                const content = `<p>Paket ${userProfile.plan} Anda telah berakhir. Akun Anda telah otomatis diubah kembali ke paket Free.</p>`;
                const emailHtml = generateEmailTemplate('Paket Anda Berakhir', `Halo ${userProfile.namaLengkap},`, content, `${process.env.FRONTEND_URL}/semua-plan`, 'Lihat Paket');
                await sendEmailNotification(userProfile.email, emailSubject, emailHtml);
            }
        }
    } catch (error) {
        console.error('Gagal menjalankan scheduler downgrade:', error);
    }
};