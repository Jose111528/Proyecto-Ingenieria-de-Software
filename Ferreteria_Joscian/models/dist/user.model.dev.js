"use strict";

var connection = require('../config/db');

var User = {
  // Crear un nuevo usuario
  create: function create(user) {
    return new Promise(function (resolve, reject) {
      var username = user.username,
          password = user.password,
          role = user.role,
          telefono = user.telefono;
      var query = 'INSERT INTO usuarios (nombre, contraseña, role, telefono) VALUES (?, ?, ?, ?)';
      connection.query(query, [username, password, role, telefono], function (error, results) {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
  // Obtener un usuario por su nombre de usuario
  getByUsername: function getByUsername(username) {
    return new Promise(function (resolve, reject) {
      var query = 'SELECT * FROM usuarios WHERE nombre = ?';
      connection.query(query, [username], function (error, results) {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
  getById: function getById(id) {
    return new Promise(function (resolve, reject) {
      var query = 'SELECT * FROM usuarios WHERE id_usuario = ?';
      connection.query(query, [id], function (error, results) {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
  deleteById: function deleteById(id) {
    return new Promise(function (resolve, reject) {
      var query = 'DELETE FROM usuarios WHERE id_usuario = ?';
      connection.query(query, [id], function (error, results) {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
  getAllWorkers: function getAllWorkers() {
    return regeneratorRuntime.async(function getAllWorkers$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              var query = 'SELECT id_usuario, nombre,contraseña,role,telefono FROM usuarios WHERE role = \'trabajador\'';
              connection.query(query, function (error, results) {
                if (error) {
                  reject(error);
                } else {
                  resolve(results);
                }
              });
            }));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    });
  }
};
module.exports = User;