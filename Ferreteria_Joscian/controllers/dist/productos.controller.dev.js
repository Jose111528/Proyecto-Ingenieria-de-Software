"use strict";

/* This JavaScript code defines a set of functions that handle CRUD operations (Create, Read, Update,
Delete) for a product entity in a Node.js application. Here's a breakdown of what each function
does: */
var Producto = require('../models/productos.model');

exports.getProductos = function (req, res) {
  Producto.getAll(function (err, results) {
    if (err) return res.status(500).json({
      error: err.message
    });
    console.log(results);
    res.json(results);
  });
};

exports.getProductoById = function (req, res) {
  var id = req.params.id;
  Producto.getById(id, function (err, results) {
    if (err) return res.status(500).json({
      error: err.message
    });

    if (results.length === 0) {
      return res.status(404).json({
        message: "Producto no encontrado"
      });
    }

    res.json(results[0]);
  });
};

exports.createProducto = function (req, res) {
  var _req$body = req.body,
      nombre_producto = _req$body.nombre_producto,
      descripcion = _req$body.descripcion,
      precio_compra = _req$body.precio_compra,
      precio_venta = _req$body.precio_venta,
      codigo_barras = _req$body.codigo_barras,
      stock = _req$body.stock,
      codigo_producto = _req$body.codigo_producto,
      stock_minimo = _req$body.stock_minimo,
      id_distribuidor_marca = _req$body.id_distribuidor_marca;

  if (!nombre_producto || !precio_venta || !codigo_barras) {
    return res.status(400).json({
      error: "Faltan campos obligatorios: nombre, precio de venta o código de barras"
    });
  }

  var newProducto = {
    nombre_producto: nombre_producto,
    descripcion: descripcion,
    precio_compra: precio_compra,
    precio_venta: precio_venta,
    codigo_barras: codigo_barras,
    stock: stock,
    codigo_producto: codigo_producto,
    stock_minimo: stock_minimo,
    id_distribuidor_marca: id_distribuidor_marca
  };
  Producto.create(newProducto, function (err, results) {
    if (err) return res.status(500).json({
      error: err.message
    });
    res.json({
      message: "Producto creado",
      id: results.insertId
    });
  });
};

exports.updateProducto = function (req, res) {
  var id = req.params.id;
  var updateData = req.body;
  Producto.getById(id, function (err, results) {
    if (err) return res.status(500).json({
      error: err.message
    });

    if (results.length === 0) {
      return res.status(404).json({
        message: "Producto no encontrado"
      });
    }

    if (!updateData.nombre_producto || !updateData.precio_venta || !updateData.codigo_barras) {
      return res.status(400).json({
        error: "Faltan campos obligatorios: nombre, precio de venta o código de barras"
      });
    }

    Producto.update(id, updateData, function (err, results) {
      if (err) return res.status(500).json({
        error: err.message
      }); // Verificar cuántas filas fueron afectadas

      if (results.affectedRows === 0) {
        return res.status(400).json({
          message: "No se realizaron cambios, los datos ya están actualizados"
        });
      }

      res.json({
        message: "Producto actualizado"
      });
    });
  });
};

exports.deleteProducto = function (req, res) {
  var id = req.params.id; // Verificar que el producto existe antes de eliminar

  Producto.getById(id, function (err, results) {
    if (err) return res.status(500).json({
      error: err.message
    });

    if (results.length === 0) {
      return res.status(404).json({
        message: "Producto no encontrado"
      });
    }

    Producto["delete"](id, function (err, results) {
      if (err) return res.status(500).json({
        error: err.message
      });
      res.json({
        message: "Producto eliminado"
      });
    });
  });
};

exports.buscarProducto = function (req, res) {
  var query = req.query.query || "";
  Producto.buscarProducto(query, function (err, results) {
    if (err) return res.status(500).json({
      error: "Error en la búsqueda"
    });
    res.json(results);
  });
};