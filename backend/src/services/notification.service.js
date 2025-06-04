import axios from 'axios';
import nodemailer from 'nodemailer';
import db from '../config/firebase.js';

const META_API_VERSION = 'v19.0';

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

export const sendEmailNotification = async (toEmail, subject, htmlBody) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let mailOptions = {
      from: `"${process.env.EMAIL_SENDER_NAME}" <${process.env.EMAIL_SENDER_ADDRESS || process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: subject,
      html: htmlBody,
    };

    let info = await transporter.sendMail(mailOptions);
    console.log(`Email berhasil dikirim ke ${toEmail}. Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`Gagal mengirim email ke ${toEmail}:`, error);
    return false;
  }
};

export const checkStockAndSendNotifications = async () => {
  console.log('Scheduler berjalan: Memeriksa stok barang (Dinamis WA & Email - Kirim Sekali per Siklus)...');
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

      if (!userProfile || !userStok) {
        console.log(`Data profil atau stok tidak lengkap untuk User: ${userId}. Skip.`);
        continue;
      }
      
      const emailPenerima = userProfile.email;
      const nomorWaPenerima = userProfile.nomorWhatsAppNotifikasi;
      const kirimNotifEmail = userProfile.hasOwnProperty('preferensiNotifikasiEmail') ? userProfile.preferensiNotifikasiEmail : true;
      const kirimNotifWhatsApp = userProfile.hasOwnProperty('preferensiNotifikasiWhatsApp') ? userProfile.preferensiNotifikasiWhatsApp : true;

      if (!kirimNotifEmail && !kirimNotifWhatsApp) {
        console.log(`Semua notifikasi dinonaktifkan untuk User: ${userId}. Skip.`);
        continue;
      }
      
      if ((!emailPenerima && kirimNotifEmail) && (!nomorWaPenerima && kirimNotifWhatsApp) ) {
          console.log(`Email dan Nomor WhatsApp tidak disetel (atau channel aktif tapi data kontak kosong) untuk User: ${userId}. Skip notifikasi untuk user ini.`);
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
              console.log(`STOK RENDAH TERDETEKSI: ${item.namaBarang} (User: ${userId}, Item: ${itemId})`);
              
              const namaBarang = item.namaBarang || 'Barang Tidak Diketahui';
              const sisaStok = jumlah.toString();
              const satuanBarang = item.satuan || 'unit';
              const batasMin = batasMinimum.toString();
              
              let waMessageSent = false;
              let emailMsgSent = false;

              if (nomorWaPenerima && kirimNotifWhatsApp && typeof nomorWaPenerima === 'string' && nomorWaPenerima.trim() !== '') {
                const templateName = 'notifikasi_stok_stockwatch'; 
                const languageCode = 'id'; 
                const templateParamsWA = [
                  { type: 'text', text: namaBarang },
                  { type: 'text', text: sisaStok },
                  { type: 'text', text: satuanBarang },
                  { type: 'text', text: batasMin },
                  { type: 'text', text: satuanBarang } 
                ];
                
                waMessageSent = await sendMetaWhatsAppMessage(
                  nomorWaPenerima,
                  templateName, 
                  languageCode, 
                  templateParamsWA
                );
              } else {
                if (kirimNotifWhatsApp) console.log(`Nomor WhatsApp tidak valid atau tidak diset untuk User: ${userId}. Skip notifikasi WA untuk item ${itemId}.`);
              }

              if (emailPenerima && kirimNotifEmail && typeof emailPenerima === 'string' && emailPenerima.trim() !== '') {
                const emailSubject = `StockWatch - Peringatan Stok Rendah - ${namaBarang}`;
                const emailBody = `
                  <p>Halo Pengguna StockWatch (Toko: ${userProfile.namaToko || 'Anda'}),</p>
                  <p>Stok untuk barang <strong>${namaBarang}</strong> hampir habis.</p>
                  <p>Jumlah saat ini : <strong>${sisaStok} ${satuanBarang}</strong>.</p>
                  <p>Batas minimum yang Anda tetapkan adalah <strong>${batasMin} ${satuanBarang}</strong>.</p>
                  <p>Segera lakukan restock untuk menghindari kehabisan barang.</p>
                  <p>Terima kasih,<br/>Tim StockWatch</p>
                `;
                emailMsgSent = await sendEmailNotification(emailPenerima, emailSubject, emailBody);
              } else {
                 if (kirimNotifEmail) console.log(`Email tidak valid atau tidak diset untuk User: ${userId}. Skip notifikasi Email untuk item ${itemId}.`);
              }
              
              if (waMessageSent || emailMsgSent) {
                await itemStokUserRef.update({ notifikasiStokRendahSudahTerkirim: true });
                console.log(`Status notifikasiStokRendahSudahTerkirim untuk ${namaBarang} (User: ${userId}, Item: ${itemId}) diupdate menjadi true.`);
              }
            } else {
              console.log(`Notifikasi untuk ${item.namaBarang} (User: ${userId}, Item: ${itemId}) sudah pernah dikirim untuk siklus stok rendah ini. Skip.`);
            }
          } else { 
            if (notifikasiSudahTerkirim) {
              await itemStokUserRef.update({ notifikasiStokRendahSudahTerkirim: null }); 
              console.log(`Status notifikasi untuk ${item.namaBarang} (User: ${userId}, Item: ${itemId}) direset karena stok sudah aman.`);
            }
          }
        } else {
          console.warn(`Data jumlah atau batasMinimum tidak valid (bukan angka) untuk item: ${item.namaBarang} (User: ${userId}, Item: ${itemId})`);
        }
      }
    }
  } catch (error) {
    console.error('Error saat menjalankan pengecekan stok (Dinamis WA & Email):', error);
  }
  console.log('Pengecekan stok selesai (Dinamis WA & Email - Kirim Sekali per Siklus).');
};