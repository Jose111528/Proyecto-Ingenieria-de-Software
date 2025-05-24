"use strict";

var verifyAdmin = function verifyAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Acceso denegado. Solo administradores pueden realizar esta acción.'
    });
  }

  next(); // Continuar con la ejecución de la siguiente función
};

module.exports = verifyAdmin;