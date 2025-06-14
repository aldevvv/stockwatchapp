import jwt from 'jsonwebtoken';
import db from '../config/firebase.js';

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Akses ditolak. Tidak ada token.' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const userProfileRef = db.ref(`users/${decoded.id}/profile`);
        const snapshot = await userProfileRef.once('value');

        if (!snapshot.exists()) {
            return res.status(401).json({ message: 'Token tidak valid, pengguna tidak ditemukan.' });
        }

        req.user = {
            id: decoded.id,
            ...snapshot.val()
        };
        
        next();
    } catch (error) {
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