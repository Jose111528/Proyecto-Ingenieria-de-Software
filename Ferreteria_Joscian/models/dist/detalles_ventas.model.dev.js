"use strict";

/* This JavaScript code defines a module named `DetalleVenta` that contains methods for interacting
with a database to handle details of sales transactions. Here's a breakdown of what the code does: */
var connection = require('../config/db');

var DetalleVenta = {
  // Obtener los detalles de una venta por su ID
  getByVentaId: function getByVentaId(id_venta, callback) {
    var sql = "\n      SELECT dv.*, p.nombre_producto\n      FROM detalle_ventas dv\n      JOIN productos p ON dv.id_producto = p.id_producto\n      WHERE dv.id_venta = ?\n    ";
    connection.query(sql, [id_venta], function (err, results) {
      if (err) {
        return callback(err, null);
      }

      callback(null, results); // Retorna los resultados
    });
  },
  // Crear un nuevo detalle de venta
  create: function create(detalles, callback) {
    // Usamos un solo query para insertar múltiples detalles si es necesario
    var sql = "\n      INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario, subtotal, ganancia_unitaria, ganancia_total)\n      VALUES ?\n    "; // `detalles` es un array de objetos, por lo que transformamos en un array de valores

    var values = detalles.map(function (detalle) {
      return [detalle.id_venta, detalle.id_producto, detalle.cantidad, detalle.precio_unitario, detalle.subtotal, detalle.ganancia_unitaria, detalle.ganancia_total];
    });
    connection.query(sql, [values], function (err, result) {
      if (err) {
        return callback(err, null);
      }

      callback(null, result);
    });
  }
};
module.exports = DetalleVenta;