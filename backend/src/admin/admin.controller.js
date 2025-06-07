import db from '../config/firebase.js';
import { sendEmailNotification, generateEmailTemplate } from '../services/notification.service.js';

export const getAllUsersProfiles = async (req, res) => {
    try {
        const usersRef = db.ref('users');
        const snapshot = await usersRef.once('value');
        const allUsersData = snapshot.val();

        if (!allUsersData) {
            return res.status(404).json({ message: 'Tidak ada data pengguna ditemukan.' });
        }

        const profiles = Object.keys(allUsersData)
            .map(userId => ({
                id: userId,
                ...(allUsersData[userId].profile || {}) 
            }))
            .filter(profile => profile.role !== 'admin');

        res.status(200).json({ message: 'Data profil semua pengguna berhasil diambil', data: profiles });
    } catch (error) {
        console.error("Error di getAllUsersProfiles:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
};

export const getUserStockForAdmin = async (req, res) => {
    try {
        const { targetUserId } = req.params;
        if (!targetUserId) {
            return res.status(400).json({ message: 'User ID target dibutuhkan.' });
        }

        const userRef = db.ref(`users/${targetUserId}`);
        const userSnapshot = await userRef.once('value');
        
        if (!userSnapshot.exists()) {
            return res.status(404).json({ message: `Pengguna dengan ID ${targetUserId} tidak ditemukan.` });
        }

        const userData = userSnapshot.val();
        const stokData = userData.stok;
        const stokList = stokData ? Object.values(stokData) : [];
        const userProfile = userData.profile || { email: 'Tidak diketahui', namaToko: 'Tidak diketahui'};

        res.status(200).json({
            message: `Data stok untuk user ${userProfile.namaLengkap || userProfile.email} (ID: ${targetUserId}) berhasil diambil`,
            userProfile: userProfile,
            dataStok: stokList
        });

    } catch (error) {
        console.error("Error di getUserStockForAdmin:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
};

export const sendMessageToUser = async (req, res) => {
    try {
        const { targetUserId, subject, messageBody } = req.body;
        const adminUser = req.user; 

        if (!targetUserId || !subject || !messageBody) {
            return res.status(400).json({ message: 'User ID target, subjek, dan isi pesan wajib diisi.' });
        }

        const targetUserProfileRef = db.ref(`users/${targetUserId}/profile`);
        const snapshot = await targetUserProfileRef.once('value');

        if (!snapshot.exists()) {
            return res.status(404).json({ message: `Profil untuk pengguna dengan ID ${targetUserId} tidak ditemukan.` });
        }

        const targetUserProfile = snapshot.val();
        const targetUserEmail = targetUserProfile.email;

        if (!targetUserEmail) {
            return res.status(400).json({ message: `Pengguna dengan ID ${targetUserId} tidak memiliki alamat email terdaftar.` });
        }
        
        const contentForEmail = `
            <p>Anda menerima pesan dari administrator StockWatch terkait akun Anda (Toko: ${targetUserProfile.namaToko || 'N/A'}).</p>
            <p><strong>Isi Pesan:</strong></p>
            <p style="padding: 10px; border-left: 3px solid #ccc; background-color: #f8f9fa;">
                ${messageBody.replace(/\n/g, '<br>')}
            </p>
            <p>Jika Anda memiliki pertanyaan, silakan balas email ini atau hubungi support kami.</p>
        `;

        const emailHtml = generateEmailTemplate(
            subject,
            `Pesan dari Admin: ${subject}`,
            contentForEmail,
            `${process.env.FRONTEND_URL || 'https://stockwatch.web.id'}/dashboard`,
            'Buka Dashboard'
        );

        const emailSent = await sendEmailNotification(
            targetUserEmail,
            `Pesan dari Admin StockWatch: ${subject}`,
            emailHtml
        );

        if (emailSent) {
            res.status(200).json({ message: `Pesan berhasil dikirim ke ${targetUserEmail}` });
        } else {
            res.status(500).json({ message: `Gagal mengirim pesan email ke ${targetUserEmail}. Coba lagi nanti.` });
        }

    } catch (error) {
        console.error("Error di sendMessageToUser:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server saat mengirim pesan.', error: error.message });
    }
};

export const getPlatformStats = async (req, res) => {
    try {
        const usersRef = db.ref('users');
        const usersSnapshot = await usersRef.once('value');
        const allUsersData = usersSnapshot.val();

        let totalRegisteredUsers = 0;
        let totalSystemStockItems = 0;
        let totalSystemSuppliers = 0;

        if (allUsersData) {
            const regularUserIds = Object.keys(allUsersData).filter(
                userId => allUsersData[userId].profile && allUsersData[userId].profile.role !== 'admin'
            );
            totalRegisteredUsers = regularUserIds.length;

            regularUserIds.forEach(userId => {
                const userStok = allUsersData[userId].stok;
                if (userStok) {
                    totalSystemStockItems += Object.keys(userStok).length;
                }
                const userSuppliers = allUsersData[userId].suppliers;
                if (userSuppliers) {
                    totalSystemSuppliers += Object.keys(userSuppliers).length;
                }
            });
        }
        
        res.status(200).json({
            message: 'Statistik platform berhasil diambil',
            data: {
                totalRegisteredUsers,
                totalSystemStockItems,
                totalSystemSuppliers,
            }
        });

    } catch (error) {
        console.error("Error di getPlatformStats:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server saat mengambil statistik.', error: error.message });
    }
};