"use strict";

/* The above code is a JavaScript module that defines a set of functions related to managing products
in a database. Here is a summary of what each function does: */
var connection = require('../config/db');

var Producto = {
  getAll: function getAll(callback) {
    var query = "\n      SELECT \n        p.id_producto, \n        p.nombre_producto, \n        p.descripcion, \n        p.precio_compra, \n        p.precio_venta, \n        p.codigo_barras, \n        p.stock, \n        p.codigo_producto,\n        p.stock_minimo,\n        m.nombre_marca, \n        d.nombre_distribuidor\n      FROM productos p\n      LEFT JOIN distribuidores_marcas dm ON p.id_distribuidor_marca = dm.id_distribuidor_marca\n      LEFT JOIN marca m ON dm.id_marca = m.id_marca\n      LEFT JOIN distribuidores d ON dm.id_distribuidor = d.id_distribuidor\n    ";
    connection.query(query, function (err, results) {
      if (err) {
        return callback(err, null);
      }

      callback(null, results);
    });
  },
  getById: function getById(id, callback) {
    var query = "\n      SELECT \n        p.id_producto, \n        p.nombre_producto, \n        p.descripcion, \n        p.precio_compra, \n        p.precio_venta, \n        p.codigo_barras, \n        p.stock, \n        p.codigo_producto,\n        p.stock_minimo,\n        m.nombre_marca, \n        d.nombre_distribuidor\n      FROM productos p\n      LEFT JOIN distribuidores_marcas dm ON p.id_distribuidor_marca = dm.id_distribuidor_marca\n      LEFT JOIN marca m ON dm.id_marca = m.id_marca\n      LEFT JOIN distribuidores d ON dm.id_distribuidor = d.id_distribuidor\n      WHERE p.id_producto = ?\n    ";
    connection.query(query, [id], function (err, results) {
      if (err) {
        return callback(err, null);
      }

      callback(null, results);
    });
  },
  create: function create(producto, callback) {
    // Validación de los datos
    if (!producto.nombre_producto || !producto.precio_venta || !producto.codigo_barras) {
      return callback(new Error('Faltan campos obligatorios: nombre, precio de venta o código de barras'), null);
    }

    var checkCodigoBarrasQuery = "SELECT * FROM productos WHERE codigo_barras = ?";
    connection.query(checkCodigoBarrasQuery, [producto.codigo_barras], function (err, results) {
      if (err) {
        return callback(err, null);
      }

      if (results.length > 0) {
        return callback(new Error('El código de barras ya está registrado'), null);
      }

      var query = "\n      INSERT INTO productos \n      (nombre_producto, descripcion, precio_compra, precio_venta, codigo_barras, stock, codigo_producto, stock_minimo, id_distribuidor_marca)\n      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)\n    ";
      var values = [producto.nombre_producto, producto.descripcion, producto.precio_compra, producto.precio_venta, producto.codigo_barras, producto.stock, producto.codigo_producto, producto.stock_minimo, producto.id_distribuidor_marca];
      connection.query(query, values, function (err, result) {
        if (err) {
          return callback(err, null);
        }

        callback(null, result);
      });
    });
  },
  update: function update(id, producto, callback) {
    // Validación de los datos
    if (!producto.nombre_producto || !producto.precio_venta || !producto.codigo_barras) {
      return callback(new Error('Faltan campos obligatorios: nombre, precio de venta o código de barras'), null);
    }

    var query = "\n      UPDATE productos SET \n        nombre_producto = ?, \n        descripcion = ?, \n        precio_compra = ?, \n        precio_venta = ?, \n        codigo_barras = ?, \n        stock = ?, \n        codigo_producto = ?, \n        stock_minimo = ?,\n        id_distribuidor_marca = ? \n      WHERE id_producto = ?\n    ";
    var values = [producto.nombre_producto, producto.descripcion, producto.precio_compra, producto.precio_venta, producto.codigo_barras, producto.stock, producto.codigo_producto, producto.stock_minimo, producto.id_distribuidor_marca, id];
    connection.query(query, values, function (err, result) {
      if (err) {
        console.error("Error al actualizar producto:", err);
        return callback(err, null);
      }

      callback(null, result);
    });
  },
  "delete": function _delete(id, callback) {
    connection.query('DELETE FROM productos WHERE id_producto = ?', [id], function (err, result) {
      if (err) {
        console.error("Error al eliminar producto:", err);
        return callback(err, null);
      }

      callback(null, result);
    });
  },
  buscarProducto: function buscarProducto(query, callback) {
    var sql = "\n      SELECT \n        p.id_producto, \n        p.nombre_producto, \n        p.descripcion, \n        p.precio_venta, \n        p.codigo_barras, \n        p.stock, \n        p.codigo_producto,\n        p.stock_minimo\n      FROM productos p\n      WHERE p.codigo_barras LIKE ? \n        OR p.nombre_producto LIKE ? \n        OR p.codigo_producto LIKE ?\n      LIMIT 10\n    ";
    var valores = ["%".concat(query, "%"), "%".concat(query, "%"), "%".concat(query, "%")];
    connection.query(sql, valores, function (err, results) {
      if (err) {
        console.error("Error al buscar producto:", err);
        return callback(err, null);
      }

      callback(null, results);
    });
  },
  reducirStock: function reducirStock(id_producto, cantidad, callback) {
    // Comprobar el stock disponible antes de reducirlo
    var checkStockQuery = "SELECT stock FROM productos WHERE id_producto = ?";
    connection.query(checkStockQuery, [id_producto], function (err, result) {
      if (err) {
        console.error("Error al verificar stock:", err);
        return callback(err, null);
      }

      var stockActual = result[0].stock;

      if (stockActual < cantidad) {
        return callback(new Error('No hay suficiente stock disponible'), null);
      } // Si el stock es suficiente, actualizar el stock


      var sql = "UPDATE productos SET stock = stock - ? WHERE id_producto = ?";
      connection.query(sql, [cantidad, id_producto], function (err, result) {
        if (err) {
          console.error("Error al reducir stock:", err);
          return callback(err, null);
        }

        callback(null, result);
      });
    });
  }
};
module.exports = Producto;