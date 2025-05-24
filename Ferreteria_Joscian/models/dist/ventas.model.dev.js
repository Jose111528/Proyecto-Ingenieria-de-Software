"use strict";

var connection = require('../config/db');

var Venta = {
  // Obtener todas las ventas
  getAll: function getAll(callback) {
    var sql = "\n      SELECT v.*, u.nombre AS nombre_usuario, c.nombre_cliente\n      FROM ventas v\n      LEFT JOIN usuarios u ON v.id_usuario = u.id_usuario\n      LEFT JOIN clientes c ON v.id_cliente = c.id_cliente\n      ORDER BY v.fecha_venta DESC\n    ";
    connection.query(sql, callback);
  },
  // Obtener una venta por su ID
  getById: function getById(id, callback) {
    var sql = "SELECT * FROM ventas WHERE id_venta = ?";
    connection.query(sql, [id], callback);
  },
  // Crear una nueva venta
  create: function create(venta, callback) {
    var sql = "\n      INSERT INTO ventas (id_usuario, fecha_venta, total, id_cliente)\n      VALUES (?, NOW(), ?, ?)\n    ";
    var values = [venta.id_usuario, venta.total, venta.id_cliente];
    connection.query(sql, values, function (err, result) {
      if (err) {
        return callback(err, null);
      }

      callback(null, result);
    });
  }
};
module.exports = Venta;