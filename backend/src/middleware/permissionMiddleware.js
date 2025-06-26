export const isOwner = (req, res, next) => {
  // Middleware ini berjalan setelah authMiddleware, jadi req.user sudah ada.
  if (req.user && req.user.role === 'pemilik') {
    next(); // Lanjutkan jika dia adalah pemilik
  } else {
    // Jika bukan pemilik, kirim respons 'Akses Ditolak'.
    res.status(403).json({ message: 'Akses ditolak. Aksi ini hanya untuk pemilik akun.' });
  }
};
