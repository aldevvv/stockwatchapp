import { sendEmailNotification, generateEmailTemplate } from '../services/notification.service.js';

export const handleContactForm = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'Semua field wajib diisi.' });
        }
        const recipientEmail = process.env.SUPPORT_EMAIL;
        if (!recipientEmail) {
            return res.status(500).json({ message: 'Konfigurasi server tidak lengkap.' });
        }
        const emailSubjectToAdmin = `Pesan Baru dari Form Kontak StockWatch : ${subject}`;
        const contentForEmail = `
            <p>Pesan baru dari form kontak:</p>
            <ul>
                <li><strong>Nama :</strong> ${name}</li>
                <li><strong>Email (untuk dibalas) :</strong> ${email}</li>
                <li><strong>Subjek :</strong> ${subject}</li>
            </ul>
            <hr>
            <p><strong>Pesan :</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
        `;
        const emailHtml = generateEmailTemplate('Pesan Baru dari Pengguna', `Dari : ${name} (${email})`, contentForEmail, null, null);
        const emailSent = await sendEmailNotification(recipientEmail, emailSubjectToAdmin, emailHtml, email);
        if (emailSent) {
            res.status(200).json({ message: 'Terima kasih! Pesan Anda telah berhasil dikirim.' });
        } else {
            res.status(500).json({ message: 'Gagal mengirim pesan email.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan saat mengirim pesan.' });
    }
};
