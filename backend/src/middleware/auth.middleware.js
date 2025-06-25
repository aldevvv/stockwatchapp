import jwt from 'jsonwebtoken';
import db from '../config/firebase.js';

export const authMiddleware = async (req, res, next) => {
    console.log('--- Auth Middleware Running ---');
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('Middleware Error: No token or incorrect format.');
        return res.status(401).json({ message: 'Akses ditolak. Tidak ada token.' });
    }

    try {
        const token = authHeader.split(' ')[1];
        
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('--- FATAL ERROR: JWT_SECRET tidak ditemukan di file .env! ---');
            return res.status(500).json({ message: 'Server tidak terkonfigurasi dengan benar.' });
        }
        console.log('JWT_SECRET ditemukan. Melanjutkan verifikasi...');

        const decoded = jwt.verify(token, secret);
        console.log('Token berhasil di-decode. User ID:', decoded.id);

        const userProfileRef = db.ref(`users/${decoded.id}/profile`);
        const snapshot = await userProfileRef.once('value');

        if (!snapshot.exists()) {
            console.log(`Middleware Error: Pengguna dengan ID ${decoded.id} tidak ditemukan di database.`);
            return res.status(401).json({ message: 'Token tidak valid, pengguna tidak ditemukan.' });
        }
        console.log('Profil pengguna ditemukan. Middleware sukses.');

        req.user = {
            id: decoded.id,
            ...snapshot.val()
        };
        
        next();
    } catch (error) {
        console.error('Middleware Catch Block Error:', error.name, '-', error.message);
        res.status(401).json({ message: 'Token tidak valid atau kedaluwarsa.' });
    }
};

export const adminAuthMiddleware = async (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Akses ditolak. Hanya untuk admin.' });
    }
};