import sgMail from '@sendgrid/mail';
import db from '../config/firebase.js';
import axios from 'axios';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const META_API_VERSION = 'v19.0';

export const generateEmailTemplate = (title, preheader, content, buttonUrl, buttonText) => {
  const logoUrl = 'https://i.ibb.co/W4BLtF9Z/Stock-Watch-Logo.jpg'; 
  const currentYear = new Date().getFullYear();

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: Arial, sans-serif;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="padding: 20px 0;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
              <tr>
                <td align="center" style="padding: 20px 0; border-bottom: 1px solid #eeeeee;">
                  <img src="${logoUrl}" alt="StockWatch Logo" width="150" style="display: block;" />
                </td>
              </tr>
              <tr>
                <td style="padding: 40px 30px;">
                  <h1 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">${title}</h1>
                  <p style="color: #555555; margin: 0 0 15px 0; font-size: 16px; line-height: 1.5;">${preheader}</p>
                  <div style="color: #555555; font-size: 16px; line-height: 1.5;">
                    ${content}
                  </div>
                </td>
              </tr>
              ${buttonUrl && buttonText ? `
              <tr>
                <td style="padding: 0 30px 40px 30px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center">
                        <a href="${buttonUrl}" target="_blank" style="background-color: #007bff; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                          ${buttonText}
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              ` : ''}
              <tr>
                <td align="center" style="padding: 20px 30px; background-color: #ecf0f1; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                  <p style="margin: 0; color: #7f8c8d; font-size: 12px;">
                    &copy; ${currentYear} StockWatch. All rights reserved.<br/>
                    Ini adalah email otomatis, mohon untuk tidak membalas.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export const sendEmailNotification = async (toEmail, subject, htmlContent) => {
  const msg = {
    to: toEmail,
    from: {
        name: process.env.EMAIL_SENDER_NAME || 'StockWatch',
        email: process.env.SENDER_VERIFIED_EMAIL,
    },
    subject: subject,
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email (HTML) berhasil dikirim ke ${toEmail} via SendGrid.`);
    return true;
  } catch (error) {
    console.error(`Gagal mengirim email via SendGrid:`, error);
    if (error.response) {
      console.error(error.response.body)
    }
    return false;
  }
};

const sendMetaWhatsAppMessage = async (to, templateName, languageCode, templateParams) => {
  const phoneNumberId = process.env.META_WA_PHONE_NUMBER_ID;
  const accessToken = process.env.META_WA_ACCESS_TOKEN;
  const recipientNumber = String(to).startsWith('whatsapp:') ? String(to).substring(9) : String(to);
  const formattedTo = recipientNumber.startsWith('+') ? recipientNumber.substring(1) : recipientNumber;

  const url = `https://graph.facebook.com/${META_API_VERSION}/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    to: formattedTo,
    type: 'template',
    template: {
      name: templateName,
      language: {
        code: languageCode,
      },
      components: [
        {
          type: 'body',
          parameters: templateParams,
        },
      ],
    },
  };
  
  if (!templateParams || templateParams.length === 0) {
    delete payload.template.components;
  }

  try {
    console.log(`Mencoba mengirim pesan Meta WA ke ${formattedTo} dengan template: ${templateName}`);
    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    console.log(`Pesan Meta WA berhasil dikirim ke ${formattedTo}. Message ID: ${response.data.messages[0].id}`);
    return true; 
  } catch (error) {
    console.error(`Gagal mengirim pesan Meta WA ke ${formattedTo}:`, error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    if (error.response && error.response.data && error.response.data.error) {
        console.error('Detail error API Meta:', JSON.stringify(error.response.data.error, null, 2));
    }
    return false; 
  }
};

export const checkStockAndSendNotifications = async () => {
  console.log('Scheduler berjalan: Memeriksa stok barang...');
  try {
    const usersRef = db.ref('users'); 
    const usersSnapshot = await usersRef.once('value');
    const allUsersData = usersSnapshot.val();

    if (!allUsersData) {
      console.log('Tidak ada data pengguna untuk diperiksa.');
      return;
    }

    for (const userId in allUsersData) {
      const userData = allUsersData[userId];
      const userProfile = userData.profile;
      const userStok = userData.stok;

      if (!userProfile || !userStok || userProfile.role === 'admin') {
        continue;
      }
      
      const emailPenerima = userProfile.email;
      const nomorWaPenerima = userProfile.nomorWhatsAppNotifikasi;
      const kirimNotifEmail = userProfile.hasOwnProperty('preferensiNotifikasiEmail') ? userProfile.preferensiNotifikasiEmail : true;
      const kirimNotifWhatsApp = userProfile.hasOwnProperty('preferensiNotifikasiWhatsApp') ? userProfile.preferensiNotifikasiWhatsApp : true;

      if (!kirimNotifEmail && !kirimNotifWhatsApp) {
        continue;
      }

      for (const itemId in userStok) {
        const item = userStok[itemId];
        const itemStokUserRef = db.ref(`users/${userId}/stok/${itemId}`); 

        const jumlah = Number(item.jumlah);
        const batasMinimum = Number(item.batasMinimum);
        const notifikasiSudahTerkirim = item.notifikasiStokRendahSudahTerkirim === true; 

        if (!isNaN(jumlah) && !isNaN(batasMinimum)) {
          if (jumlah <= batasMinimum) {
            if (!notifikasiSudahTerkirim) {
              console.log(`STOK RENDAH TERDETEKSI: ${item.namaBarang} (User: ${userId})`);
              
              const namaBarang = item.namaBarang || 'Barang Tidak Diketahui';
              const sisaStok = jumlah.toString();
              const satuanBarang = item.satuan || 'unit';
              const batasMin = batasMinimum.toString();
              
              let waMessageSent = false;
              let emailMsgSent = false;

              if (nomorWaPenerima && kirimNotifWhatsApp && typeof nomorWaPenerima === 'string' && nomorWaPenerima.trim() !== '') {
                // Logika pengiriman WhatsApp bisa ditambahkan kembali di sini jika diperlukan
              }

              if (emailPenerima && kirimNotifEmail && typeof emailPenerima === 'string' && emailPenerima.trim() !== '') {
                const emailSubject = `Peringatan Stok Rendah - ${namaBarang}`;
                const preheader = `Stok untuk ${namaBarang} telah mencapai batas minimum.`;
                const contentForEmail = `
                  <p>Stok untuk barang <strong>${namaBarang}</strong> hampir habis.</p>
                  <p>Jumlah saat ini: <strong>${sisaStok} ${satuanBarang}</strong>.</p>
                  <p>Batas minimum yang Anda tetapkan adalah <strong>${batasMin} ${satuanBarang}</strong>.</p>
                  <p>Segera lakukan restock untuk menghindari kehabisan barang!</p>
                `;
                const emailHtml = generateEmailTemplate(
                    'Peringatan Stok Rendah!',
                    preheader,
                    contentForEmail,
                    `${process.env.FRONTEND_URL || 'https://stockwatch.web.id'}/dashboard`,
                    'Lihat Dashboard'
                );
                
                emailMsgSent = await sendEmailNotification(emailPenerima, emailSubject, emailHtml);
              }
              
              if (waMessageSent || emailMsgSent) {
                await itemStokUserRef.update({ notifikasiStokRendahSudahTerkirim: true });
                console.log(`Status notifikasi untuk ${namaBarang} (User: ${userId}) diupdate menjadi true.`);
              }
            }
          } else { 
            if (notifikasiSudahTerkirim) {
              await itemStokUserRef.update({ notifikasiStokRendahSudahTerkirim: null }); 
              console.log(`Status notifikasi untuk ${item.namaBarang} (User: ${userId}) direset.`);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error saat menjalankan pengecekan stok:', error);
  }
  console.log('Pengecekan stok selesai.');
};