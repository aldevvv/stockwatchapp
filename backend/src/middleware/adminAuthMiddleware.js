export const adminAuthMiddleware = async (req, res, next) => {
  // Middleware ini harus dijalankan SETELAH authMiddleware
  if (req.user && req.user.role === 'admin') {
    next(); // Lanjutkan jika pengguna adalah admin
  } else {
    res.status(403).json({ message: 'Akses ditolak. Hanya untuk admin.' });
  }
};
