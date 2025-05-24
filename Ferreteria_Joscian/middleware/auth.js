// middlewares/auth.middleware.js

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // Para cargar las variables de entorno (como tu clave secreta)

const secretKey = process.env.JWT_SECRET_KEY || 'tu_clave_secreta'; // Clave secreta

// Middleware para verificar el token de autenticación
const verifyToken = (req, res, next) => {
  // Obtener el token desde las cabeceras (Authorization)
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No hay token.' });
  }

  try {
    // Verificar el token usando la clave secreta
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Guardar la información del usuario decodificada en el objeto `req`
    next(); // Pasar a la siguiente ruta
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};

module.exports = { verifyToken };
