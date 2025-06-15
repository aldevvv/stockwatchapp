import sgMail from '@sendgrid/mail';
import db from '../config/firebase.js';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const generateEmailTemplate = (title, preheader, content, buttonUrl, buttonText) => {
  const logoUrl = 'https://i.ibb.co/W4BLtF9Z/Stock-Watch-Logo.jpg'; 
  const currentYear = new Date().getFullYear();
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>${title}</title></head>
    <body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: Arial, sans-serif;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr><td style="padding: 20px 0;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
              <tr><td align="center" style="padding: 20px 0; border-bottom: 1px solid #eeeeee;"><img src="${logoUrl}" alt="StockWatch Logo" width="150" style="display: block;" /></td></tr>
              <tr><td style="padding: 40px 30px;"><h1 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">${title}</h1><p style="color: #555555; margin: 0 0 15px 0; font-size: 16px; line-height: 1.5;">${preheader}</p><div style="color: #555555; font-size: 16px; line-height: 1.5;">${content}</div></td></tr>
              ${buttonUrl && buttonText ? `<tr><td style="padding: 0 30px 40px 30px;"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center"><a href="${buttonUrl}" target="_blank" style="background-color: #16a34a; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">${buttonText}</a></td></tr></table></td></tr>` : ''}
              <tr><td align="center" style="padding: 20px 30px; background-color: #ecf0f1; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;"><p style="margin: 0; color: #7f8c8d; font-size: 12px;">&copy; ${currentYear} StockWatch. All rights reserved.<br/>Ini adalah email otomatis, mohon untuk tidak membalas.</p></td></tr>
            </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;
};

export const sendEmailNotification = async (toEmail, subject, htmlContent, replyTo = null) => {
  const msg = {
    to: toEmail,
    from: { name: process.env.EMAIL_SENDER_NAME || 'StockWatch', email: process.env.SENDER_VERIFIED_EMAIL, },
    subject: subject,
    html: htmlContent,
  };
  if (replyTo) {
    msg.reply_to = { email: replyTo };
  }
  try {
    await sgMail.send(msg);
    console.log(`Email berhasil dikirim ke ${toEmail} via SendGrid.`);
    return true;
  } catch (error) {
    console.error(`Gagal mengirim email via SendGrid:`, error.response?.body || error);
    return false;
  }
};

export const checkStockAndSendNotifications = async () => {
  console.log('Scheduler berjalan: Memeriksa stok barang...');
  try {
    const usersRef = db.ref('users'); 
    const usersSnapshot = await usersRef.once('value');
    const allUsersData = usersSnapshot.val();

    if (!allUsersData) return;

    for (const userId in allUsersData) {
      const userProfile = allUsersData[userId]?.profile;
      if (!userProfile || userProfile.role === 'admin') {
        continue;
      }
      
      const kirimNotifEmail = userProfile.hasOwnProperty('preferensiNotifikasiEmail') ? userProfile.preferensiNotifikasiEmail : true;
      if (!kirimNotifEmail) continue;
      
      const emailPenerima = userProfile.email;
      if (!emailPenerima) continue;
      
      const userStokRef = db.ref(`stok/${userId}`);
      const userStokSnapshot = await userStokRef.once('value');
      const userStok = userStokSnapshot.val();

      if (!userStok) continue;

      for (const itemId in userStok) {
        const item = userStok[itemId];
        const itemStokRef = db.ref(`stok/${userId}/${itemId}`); 
        const jumlah = Number(item.jumlah);
        const batasMinimum = Number(item.batasMinimum);
        const notifikasiSudahTerkirim = item.notifikasiStokRendahSudahTerkirim === true;

        if (!isNaN(jumlah) && !isNaN(batasMinimum)) {
          if (jumlah <= batasMinimum) {
            if (!notifikasiSudahTerkirim) {
              const namaBarang = item.namaBarang || 'Barang Tidak Diketahui';
              const emailSubject = `Peringatan Stok Rendah - ${namaBarang}`;
              const preheader = `Stok untuk ${namaBarang} telah mencapai batas minimum.`;
              const contentForEmail = `<p>Stok untuk barang <strong>${namaBarang}</strong> hampir habis. Jumlah saat ini adalah <strong>${jumlah} ${item.satuan}</strong>. Segera lakukan restock untuk menghindari kehabisan stock.</p>`;
              const emailHtml = generateEmailTemplate('Peringatan Stok Rendah!', preheader, contentForEmail, `${process.env.FRONTEND_URL}/stock-list`, 'Lihat Daftar Stok');
              
              const emailTerkirim = await sendEmailNotification(emailPenerima, emailSubject, emailHtml);

              if (emailTerkirim) {
                await itemStokRef.update({ notifikasiStokRendahSudahTerkirim: true });
                console.log(`Notifikasi stok rendah untuk "${namaBarang}" telah dikirim ke ${emailPenerima}.`);
              }
            }
          } else { 
            if (notifikasiSudahTerkirim) {
              await itemStokRef.update({ notifikasiStokRendahSudahTerkirim: null }); 
              console.log(`Status notifikasi untuk "${item.namaBarang}" direset.`);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error saat menjalankan pengecekan stok:', error);
  }
};