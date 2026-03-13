const jwt = require('jsonwebtoken'); //para leer y verificar tokens JWT
const User = require('../models/User');

const authMiddleware = (req, res, next) => {
  // Leer el header Authorization
   const authHeader = req.headers['authorization'];

  //si no hay header, denegar acceso
  if (!authHeader) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token' });
  }

  // Extraer el token (viene como "Bearer <token>")
  const token = authHeader && authHeader.split(' ')[1];

  // Si no hay token, denegar acceso
  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      }
      const user = await User.findById(payload.userId);
      if (!user) {
        return res.status(401).json({ message: 'Usuario no encontrado' });
      }
      req.user = user;
      next();
    });
  };

module.exports = authMiddleware;