import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import db from '../config/firebase.js';
import { sendEmailNotification, generateEmailTemplate } from '../services/notification.service.js';

export const register = async (req, res) => {
  try {
    const { namaLengkap, namaToko, email, nomorWhatsAppNotifikasi, password } = req.body;

    if (!namaLengkap || !namaToko || !email || !nomorWhatsAppNotifikasi || !password) {
      return res.status(400).json({ message: 'Semua field wajib diisi.' });
    }

    const usersRef = db.ref('users');
    const emailCheckSnapshot = await usersRef.orderByChild('profile/email').equalTo(email).once('value');
    if (emailCheckSnapshot.exists()) {
      return res.status(400).json({ message: 'Email ini sudah terdaftar.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    
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
        createdAt: Date.now(),
        fotoProfilUrl: 'https://www.iconpacks.net/icons/2/free-user-icon-3297-thumb.png',
        plan: 'Free',
        saldo: 0,
        planExpiry: null
      },
      credentials: {
        password: hashedPassword
      },
      verification: {
        emailToken: emailVerificationToken,
        emailTokenExpires: Date.now() + 3600000
      }
    };

    await db.ref(`users/${newUserId}`).set(userData);

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${emailVerificationToken}`;
    const emailSubject = 'Verifikasi Email Akun StockWatch Anda';
    const contentForEmail = `<p>Selamat datang di StockWatch, ${namaLengkap}! Klik tombol di bawah untuk verifikasi.</p>`;
    const emailHtml = generateEmailTemplate('Selamat Datang!', 'Aktifkan akun Anda', contentForEmail, verificationUrl, 'Verifikasi Email');
    
    await sendEmailNotification(email, emailSubject, emailHtml);
    
    res.status(201).json({ message: `Registrasi berhasil. Silakan cek email Anda.` });

  } catch (error) {
    console.error("Error di register:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: error.message });
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
      return res.status(404).json({ message: 'Email yang Anda masukkan tidak terdaftar.' });
    }
    let userId;
    let userData;
    snapshot.forEach(childSnapshot => {
      userId = childSnapshot.key;
      userData = childSnapshot.val();
    });

    if (userData.profile?.statusAkun === 'dinonaktifkan') {
        return res.status(403).json({ message: 'Akun Anda telah dinonaktifkan. Hubungi support untuk mengaktifkan kembali.' });
    }
    
    if (!userData.profile?.isEmailVerified) {
      return res.status(403).json({ message: 'Email belum diverifikasi. Silakan cek email Anda.' });
    }
    const isMatch = await bcrypt.compare(password, userData.credentials.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Password yang Anda masukkan salah.' });
    }
    
    const profile = userData.profile;
    const userPayloadForJwt = { id: userId, role: profile.role };
    const token = jwt.sign(userPayloadForJwt, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    
    const userProfileResponse = {
        id: userId,
        email: profile.email,
        namaLengkap: profile.namaLengkap,
        namaToko: profile.namaToko,
        role: profile.role,
        fotoProfilUrl: profile.fotoProfilUrl || ''
    };
    res.json({ message: 'Login berhasil!', token, user: userProfileResponse });
  } catch (error) {
    console.error("Error di login:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: error.message });
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
    });
    if (!userData.verification || userData.verification.emailTokenExpires < Date.now()) {
      await db.ref(`users/${userId}/verification`).remove();
      return res.status(400).json({ message: 'Token verifikasi tidak valid atau sudah kedaluwarsa.' });
    }
    await db.ref(`users/${userId}/profile`).update({ isEmailVerified: true });
    await db.ref(`users/${userId}/verification`).remove();
    res.status(200).json({ message: 'Email berhasil diverifikasi. Anda sekarang bisa login.' });
  } catch (error) {
    console.error("Error di verifyEmail:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: error.message });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email wajib diisi.' });
    const usersRef = db.ref('users');
    const snapshot = await usersRef.orderByChild('profile/email').equalTo(email).once('value');
    if (!snapshot.exists()) {
      return res.status(200).json({ message: 'Jika email Anda terdaftar, link reset password akan dikirim.' });
    }
    let userId;
    snapshot.forEach(child => { userId = child.key; });
    const passwordResetToken = crypto.randomBytes(32).toString('hex');
    await db.ref(`users/${userId}/passwordReset`).set({ token: passwordResetToken, expires: Date.now() + 3600000 });
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${passwordResetToken}`;
    const emailSubject = 'Reset Password Akun StockWatch Anda';
    const content = `<p>Kami menerima permintaan untuk mereset password. Klik tombol di bawah. Link ini akan kedaluwarsa dalam 1 jam.</p>`;
    const emailHtml = generateEmailTemplate('Permintaan Reset Password', 'Lupa Password?', content, resetUrl, 'Reset Password');
    await sendEmailNotification(email, emailSubject, emailHtml);
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
    if (!password || password !== confirmPassword || password.length < 6) {
      return res.status(400).json({ message: 'Password tidak valid atau tidak cocok.' });
    }
    const usersRef = db.ref('users');
    const snapshot = await usersRef.orderByChild('passwordReset/token').equalTo(token).once('value');
    if (!snapshot.exists()) {
      return res.status(400).json({ message: 'Token reset password tidak valid atau sudah digunakan.' });
    }
    let userId, userData;
    snapshot.forEach(child => { userId = child.key; userData = child.val(); });
    if (!userData.passwordReset || userData.passwordReset.expires < Date.now()) {
      await db.ref(`users/${userId}/passwordReset`).remove();
      return res.status(400).json({ message: 'Token reset password tidak valid atau sudah kedaluwarsa.' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await db.ref(`users/${userId}/credentials`).update({ password: hashedPassword });
    await db.ref(`users/${userId}/passwordReset`).remove();
    res.status(200).json({ message: 'Password berhasil direset. Silakan login.' });
  } catch (error) {
    console.error("Error di resetPassword:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};