export const adminAuthMiddleware = (req, res, next) => {
  console.log('Admin Middleware - Memeriksa User Data:', req.user); 
  if (req.user && req.user.role === 'admin') {
    console.log('Admin Middleware - Akses DIIZINKAN untuk role:', req.user.role);
    next();
  } else {
    console.log('Admin Middleware - Akses DITOLAK. Role saat ini:', req.user ? req.user.role : 'Tidak ada data user'); 
    res.status(403).json({ message: 'Akses ditolak. Fitur ini hanya untuk administrator.' });
  }
};