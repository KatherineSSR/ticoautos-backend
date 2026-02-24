const jwt = require('jsonwebtoken'); //para leer y verificar tokens JWT

const authMiddleware = (req, res, next) => {
  // Leer el header Authorization
  const authHeader = req.headers.authorization;

  //si no hay header, denegar acceso
  if (!authHeader) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token' });
  }

  // Extraer el token (viene como "Bearer <token>")
  const token = authHeader.split(' ')[1];

  // Si no hay token, denegar acceso
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. Token mal formateado' });
  }

  try {
    // Verificar el token: que haya sido firmado con nuestra clave, que no haya expirado y no haya sido modificado
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Agregar los datos del usuario a req.user para que el controller sepa quien hace la peticion
    req.user = decoded;

    // Dejar pasar a la siguiente función si todo esta bien
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = authMiddleware;