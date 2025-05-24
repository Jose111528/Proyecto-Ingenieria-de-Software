"use strict";

var connection = require('../config/db');

var ConversionUnidad = {
  getByProducto: function getByProducto(id_producto, callback) {
    var query = "\n      SELECT \n        cu.id_conversion,\n        cu.id_producto,\n        cu.id_unidad_origen,\n        cu.id_unidad_destino,\n        cu.factor_conversion,\n        uo.nombre_unidad AS unidad_origen,\n        ud.nombre_unidad AS unidad_destino\n      FROM conversiones_unidad cu\n      JOIN unidades_medida uo ON cu.id_unidad_origen = uo.id_unidad\n      JOIN unidades_medida ud ON cu.id_unidad_destino = ud.id_unidad\n      WHERE cu.id_producto = ?\n    ";
    connection.query(query, [id_producto], function (err, results) {
      if (err) {
        console.error("Error al obtener conversiones:", err);
        return callback(err, null);
      }

      callback(null, results);
    });
  },
  create: function create(conversion, callback) {
    var query = "\n      INSERT INTO conversiones_unidad \n      (id_producto, id_unidad_origen, id_unidad_destino, factor_conversion)\n      VALUES (?, ?, ?, ?)\n    ";
    var values = [conversion.id_producto, conversion.id_unidad_origen, conversion.id_unidad_destino, conversion.factor_conversion];
    connection.query(query, values, function (err, result) {
      if (err) {
        console.error("Error al insertar conversión:", err);
        return callback(err, null);
      }

      callback(null, result);
    });
  }
};
module.exports = ConversionUnidad;