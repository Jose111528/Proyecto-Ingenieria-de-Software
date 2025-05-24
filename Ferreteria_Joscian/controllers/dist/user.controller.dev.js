"use strict";

/* This JavaScript code represents a user controller file for a Node.js application. Here's a breakdown
of what each function does: */
var bcrypt = require('bcryptjs'); // Usando bcryptjs para encriptar contraseñas


var jwt = require('jsonwebtoken'); // Usando jsonwebtoken para generar JWT


var User = require('../models/user.model'); // Registrar un nuevo usuario


exports.registerUser = function _callee(req, res) {
  var _req$body, username, password, role, telefono, existingUser, hashedPassword, newUser, result;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, username = _req$body.username, password = _req$body.password, role = _req$body.role, telefono = _req$body.telefono;
          _context.prev = 1;

          if (['admin', 'trabajador'].includes(role)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: 'El rol debe ser "admin" o "trabajador"'
          }));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(User.getByUsername(username));

        case 6:
          existingUser = _context.sent;

          if (!(existingUser.length > 0)) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: 'El usuario ya existe'
          }));

        case 9:
          _context.next = 11;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 11:
          hashedPassword = _context.sent;
          // Crear el nuevo usuario
          newUser = {
            username: username,
            password: hashedPassword,
            role: role,
            telefono: telefono
          };
          _context.next = 15;
          return regeneratorRuntime.awrap(User.create(newUser));

        case 15:
          result = _context.sent;
          res.status(201).json({
            message: 'Usuario registrado correctamente',
            userId: result.insertId
          });
          _context.next = 23;
          break;

        case 19:
          _context.prev = 19;
          _context.t0 = _context["catch"](1);
          console.error(_context.t0);
          res.status(500).json({
            message: 'Error al registrar el usuario',
            error: _context.t0.message
          });

        case 23:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 19]]);
}; // Iniciar sesión de usuario


exports.loginUser = function _callee2(req, res) {
  var _req$body2, username, password, users, user, isMatch, payload, token;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, username = _req$body2.username, password = _req$body2.password;
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(User.getByUsername(username));

        case 4:
          users = _context2.sent;

          if (!(users.length === 0)) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: 'Usuario no encontrado'
          }));

        case 7:
          user = users[0];
          _context2.next = 10;
          return regeneratorRuntime.awrap(bcrypt.compare(password, user.contraseña));

        case 10:
          isMatch = _context2.sent;

          if (isMatch) {
            _context2.next = 13;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: 'Contraseña incorrecta'
          }));

        case 13:
          // Crear un payload para el JWT
          payload = {
            userId: user.id_usuario,
            role: user.role
          };
          token = jwt.sign(payload, 'tu_secreto_aqui', {
            expiresIn: '24h'
          });
          res.status(200).json({
            message: 'Login exitoso',
            token: token
          });
          _context2.next = 21;
          break;

        case 18:
          _context2.prev = 18;
          _context2.t0 = _context2["catch"](1);
          res.status(500).json({
            message: 'Error al autenticar el usuario',
            error: _context2.t0.message
          });

        case 21:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 18]]);
}; // Eliminar un usuario


exports.deleteUser = function _callee3(req, res) {
  var id;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          id = req.params.id;
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(User.deleteById(id));

        case 4:
          res.status(200).json({
            message: 'Usuario eliminado correctamente'
          });
          _context3.next = 10;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](1);
          res.status(500).json({
            message: 'Error al eliminar el usuario',
            error: _context3.t0.message
          });

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 7]]);
}; // Obtener todos los trabajadores (solo para administradores)


exports.getAllWorkers = function _callee4(req, res) {
  var workers;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(User.getAllWorkers());

        case 3:
          workers = _context4.sent;
          res.status(200).json(workers);
          _context4.next = 10;
          break;

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          res.status(500).json({
            message: 'Error al obtener trabajadores',
            error: _context4.t0.message
          });

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
};