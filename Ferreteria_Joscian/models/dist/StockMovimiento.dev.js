"use strict";

var connection = require('../config/db');

var StockMovimiento = {
  registrarMovimiento: function registrarMovimiento(movimiento, callback) {
    var query = "\n      INSERT INTO movimientos_stock \n      (id_producto, tipo_movimiento, cantidad, id_unidad, fecha_movimiento, descripcion)\n      VALUES (?, ?, ?, ?, NOW(), ?)\n    ";
    var values = [movimiento.id_producto, movimiento.tipo_movimiento, // 'entrada' o 'salida'
    movimiento.cantidad, movimiento.id_unidad, movimiento.descripcion || ''];
    connection.query(query, values, function (err, result) {
      if (err) {
        console.error("Error al registrar movimiento de stock:", err);
        return callback(err, null);
      }

      callback(null, result);
    });
  },
  getByProducto: function getByProducto(id_producto, callback) {
    var query = "\n      SELECT \n        ms.id_movimiento,\n        ms.tipo_movimiento,\n        ms.cantidad,\n        um.nombre_unidad,\n        ms.fecha_movimiento,\n        ms.descripcion\n      FROM movimientos_stock ms\n      JOIN unidades_medida um ON ms.id_unidad = um.id_unidad\n      WHERE ms.id_producto = ?\n      ORDER BY ms.fecha_movimiento DESC\n    ";
    connection.query(query, [id_producto], function (err, results) {
      if (err) {
        console.error("Error al obtener movimientos de stock:", err);
        return callback(err, null);
      }

      callback(null, results);
    });
  }
};
module.exports = StockMovimiento;