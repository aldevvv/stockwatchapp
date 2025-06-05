import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Auth Middleware - Akses DITOLAK: Token tidak ditemukan atau format salah.');
    return res.status(401).json({ message: 'Akses ditolak, token tidak ditemukan.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    console.log('Auth Middleware - Token Decoded & User Ditetapkan:', req.user);
    next(); 
  } catch (error) {
    console.log('Auth Middleware - Akses DITOLAK: Token tidak valid.', error.message);
    return res.status(403).json({ message: 'Token tidak valid.' });
  }
};