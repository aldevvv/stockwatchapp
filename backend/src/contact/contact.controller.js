import { sendEmailNotification, generateEmailTemplate } from '../services/notification.service.js';

export const handleContactForm = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'Semua field wajib diisi.' });
        }

        const recipientEmail = process.env.SUPPORT_EMAIL;
        if (!recipientEmail) {
            console.error("SUPPORT_EMAIL tidak diatur di .env");
            return res.status(500).json({ message: 'Konfigurasi server tidak lengkap.' });
        }

        const emailSubjectToAdmin = `Pesan Baru dari Form Kontak StockWatch - ${subject}`;
        
        const contentForEmail = `
            <p>Anda menerima pesan baru dari form kontak di website.</p>
            <ul>
                <li><strong>Nama Pengirim -</strong> ${name}</li>
                <li><strong>Email Pengirim (untuk dibalas) -</strong> ${email}</li>
                <li><strong>Subjek -</strong> ${subject}</li>
            </ul>
            <hr>
            <p><strong>Isi Pesan :</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
        `;
        
        const emailHtml = generateEmailTemplate(
            'Pesan Baru dari Pengguna',
            `Dari: ${name} (${email})`,
            contentForEmail,
            null,
            null
        );

        const emailSent = await sendEmailNotification(
            recipientEmail,
            emailSubjectToAdmin,
            emailHtml,
            email 
        );

        if (emailSent) {
            res.status(200).json({ message: 'Terima kasih! Pesan Anda telah berhasil dikirim.' });
        } else {
            res.status(500).json({ message: 'Gagal mengirim pesan email. Coba lagi nanti.' });
        }

    } catch (error) {
        console.error("Error di handleContactForm:", error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengirim pesan.' });
    }
};