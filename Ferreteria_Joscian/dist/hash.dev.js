"use strict";

var bcrypt = require('bcryptjs');

console.log("Iniciando proceso de hash...");

function hashPassword() {
  var hashed;
  return regeneratorRuntime.async(function hashPassword$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          console.log("Generando hash...");
          _context.next = 4;
          return regeneratorRuntime.awrap(bcrypt.hash("123456", 10));

        case 4:
          hashed = _context.sent;
          console.log("Contraseña encriptada:", hashed);
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.error("Error al generar hash:", _context.t0);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
}

hashPassword();