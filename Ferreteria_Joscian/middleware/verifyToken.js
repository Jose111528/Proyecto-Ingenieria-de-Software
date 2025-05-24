const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se encontró el token.' });
  }

  try {
    const decoded = jwt.verify(token, 'tu_secreto_aqui');  // Asegúrate de usar tu secreto aquí
    req.user = decoded;  // Guardar la información del usuario en la solicitud
    next();  // Continuar con la ejecución de la siguiente función
  } catch (error) {
    res.status(400).json({ message: 'Token no válido', error: error.message });
  }
};

module.exports = verifyToken;
