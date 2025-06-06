import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import db from '../config/firebase.js';
import { sendEmailNotification, generateEmailTemplate } from '../services/notification.service.js';

export const register = async (req, res) => {
  try {
    const { namaLengkap, namaToko, email, nomorWhatsAppNotifikasi, password } = req.body;

    if (!namaLengkap || !namaToko || !email || !nomorWhatsAppNotifikasi || !password) {
      return res.status(400).json({ message: 'Semua field (Nama Lengkap, Nama Toko, Email, No. WhatsApp, Password) wajib diisi.' });
    }

    const usersRef = db.ref('users');
    const emailCheckSnapshot = await usersRef.orderByChild('profile/email').equalTo(email).once('value');
    if (emailCheckSnapshot.exists()) {
      return res.status(400).json({ message: 'Email ini sudah terdaftar.' });
    }

    const phoneCheckSnapshot = await usersRef.orderByChild('profile/nomorWhatsAppNotifikasi').equalTo(nomorWhatsAppNotifikasi).once('value');
    if (phoneCheckSnapshot.exists()) {
      return res.status(400).json({ message: 'Nomor WhatsApp ini sudah terdaftar.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationTokenExpires = Date.now() + 3600000;

    const newUserRef = usersRef.push();
    const newUserId = newUserRef.key;

    const userData = {
      profile: {
        namaLengkap,
        email,
        namaToko,
        nomorWhatsAppNotifikasi,
        isEmailVerified: false,
        role: 'user', 
        createdAt: new Date().toISOString()
      },
      credentials: {
        password: hashedPassword
      },
      verification: {
        emailToken: emailVerificationToken,
        emailTokenExpires: emailVerificationTokenExpires
      },
      stok: {}
    };

    await db.ref(`users/${newUserId}`).set(userData);

    const verificationUrl = `${process.env.FRONTEND_URL || 'https://stockwatch.web.id'}/verify-email/${emailVerificationToken}`;
    const emailSubject = 'Verifikasi Email Akun StockWatch Anda';
    const contentForEmail = `
        <p>Selamat datang di StockWatch, ${namaLengkap}!</p>
        <p>Terima kasih telah mendaftar. Silakan klik tombol di bawah ini untuk memverifikasi alamat email Anda. Link ini akan kedaluwarsa dalam 1 jam.</p>
    `;
    const emailHtml = generateEmailTemplate(
        'Selamat Datang di StockWatch!',
        'Satu langkah lagi untuk mengaktifkan akun Anda.',
        contentForEmail,
        verificationUrl,
        'Verifikasi Email Saya'
    );

    const emailSent = await sendEmailNotification(email, emailSubject, emailHtml);
    if (emailSent) {
      console.log(`Email verifikasi berhasil dikirim ke ${email}.`);
    } else {
      console.warn(`Gagal mengirim email verifikasi ke ${email}, namun registrasi tetap dilanjutkan.`);
    }

    res.status(201).json({ 
      message: `Registrasi berhasil untuk ${email}. Silakan cek email Anda untuk verifikasi.` 
    });

  } catch (error) {
    console.error("Error di register:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server saat registrasi', error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi.' });
  }

  try {
    const usersRef = db.ref('users');
    const snapshot = await usersRef.orderByChild('profile/email').equalTo(email).once('value');
    
    if (!snapshot.exists()) {
      return res.status(401).json({ message: 'Kredensial tidak valid.' });
    }

    let userId;
    let userData;
    snapshot.forEach(childSnapshot => {
      userId = childSnapshot.key;
      userData = childSnapshot.val();
      return true; 
    });

    if (!userData.profile?.isEmailVerified) {
      return res.status(403).json({ message: 'Email belum diverifikasi. Silakan cek email Anda.' });
    }

    const storedPassword = userData.credentials?.password;
    if (!storedPassword) {
      return res.status(401).json({ message: 'Kredensial tidak valid (data pengguna tidak lengkap).' });
    }

    const isMatch = await bcrypt.compare(password, storedPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Kredensial tidak valid.' });
    }

    const userRole = userData.profile?.role || 'user';

    const userPayloadForJwt = { 
      id: userId, 
      email: userData.profile.email,
      role: userRole
    };
    const token = jwt.sign(userPayloadForJwt, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    const userProfileResponse = {
        id: userId,
        email: userData.profile.email,
        namaLengkap: userData.profile.namaLengkap,
        namaToko: userData.profile.namaToko,
        role: userRole
    };

    res.json({
      message: 'Login berhasil!',
      token,
      user: userProfileResponse 
    });

  } catch (error) {
    console.error("Error di login:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server saat login', error: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const usersRef = db.ref('users');
    const snapshot = await usersRef.orderByChild('verification/emailToken').equalTo(token).once('value');

    if (!snapshot.exists()) {
      return res.status(400).json({ message: 'Token verifikasi tidak valid atau sudah digunakan.' });
    }

    let userId;
    let userData;
    snapshot.forEach(childSnapshot => {
      userId = childSnapshot.key;
      userData = childSnapshot.val();
      return true;
    });

    if (!userData.verification || userData.verification.emailToken !== token || userData.verification.emailTokenExpires < Date.now()) {
      await db.ref(`users/${userId}/verification`).remove();
      return res.status(400).json({ message: 'Token verifikasi tidak valid atau sudah kedaluwarsa.' });
    }

    await db.ref(`users/${userId}/profile`).update({ isEmailVerified: true });
    await db.ref(`users/${userId}/verification`).remove();

    res.status(200).json({ message: 'Email berhasil diverifikasi. Anda sekarang bisa login.' });

  } catch (error) {
    console.error("Error di verifyEmail:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server saat verifikasi email.', error: error.message });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email wajib diisi.' });
    }

    const usersRef = db.ref('users');
    const snapshot = await usersRef.orderByChild('profile/email').equalTo(email).once('value');

    if (!snapshot.exists()) {
      return res.status(200).json({ message: 'Jika email Anda terdaftar, link reset password akan dikirim.' });
    }

    let userId;
    let userProfileData;
    snapshot.forEach(childSnapshot => {
      userId = childSnapshot.key;
      userProfileData = childSnapshot.val().profile;
      return true;
    });

    const passwordResetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetTokenExpires = Date.now() + 3600000; 

    await db.ref(`users/${userId}/passwordReset`).set({
      token: passwordResetToken,
      expires: passwordResetTokenExpires
    });

    const resetUrl = `${process.env.FRONTEND_URL || 'https://stockwatch.web.id'}/reset-password/${passwordResetToken}`;
    const emailSubject = 'Reset Password Akun StockWatch Anda';
    const contentForEmail = `
        <p>Halo ${userProfileData.namaLengkap || ''},</p>
        <p>Kami menerima permintaan untuk mereset password akun Anda. Klik tombol di bawah untuk melanjutkan. Link ini akan kedaluwarsa dalam 1 jam.</p>
        <p>Jika Anda tidak merasa meminta ini, abaikan saja email ini.</p>
    `;
    const emailHtml = generateEmailTemplate(
        'Permintaan Reset Password',
        'Ikuti instruksi untuk mereset password Anda.',
        contentForEmail,
        resetUrl,
        'Reset Password Sekarang'
    );
    
    const emailSent = await sendEmailNotification(email, emailSubject, emailHtml);
    if (emailSent) {
        console.log(`Email reset password berhasil dikirim ke ${email}.`);
    } else {
        console.warn(`Gagal mengirim email reset password ke ${email}, namun proses tetap dilanjutkan di sisi server.`);
    }

    res.status(200).json({ message: 'Jika email Anda terdaftar, link reset password akan dikirim.' });

  } catch (error) {
    console.error("Error di requestPasswordReset:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({ message: 'Password baru dan konfirmasi password wajib diisi.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Password baru dan konfirmasi password tidak cocok.' });
    }
    if (password.length < 6) { 
        return res.status(400).json({ message: 'Password minimal harus 6 karakter.' });
    }

    const usersRef = db.ref('users');
    const snapshot = await usersRef.orderByChild('passwordReset/token').equalTo(token).once('value');

    if (!snapshot.exists()) {
      return res.status(400).json({ message: 'Token reset password tidak valid atau sudah digunakan.' });
    }

    let userId;
    let userData;
    snapshot.forEach(childSnapshot => {
      userId = childSnapshot.key;
      userData = childSnapshot.val();
      return true;
    });

    if (!userData.passwordReset || userData.passwordReset.token !== token || userData.passwordReset.expires < Date.now()) {
      await db.ref(`users/${userId}/passwordReset`).remove();
      return res.status(400).json({ message: 'Token reset password tidak valid atau sudah kedaluwarsa.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.ref(`users/${userId}/credentials`).update({ password: hashedPassword });
    await db.ref(`users/${userId}/passwordReset`).remove();

    res.status(200).json({ message: 'Password berhasil direset. Silakan login dengan password baru Anda.' });

  } catch (error) {
    console.error("Error di resetPassword:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};