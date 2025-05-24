"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* This JavaScript code defines a function `vender` that handles the process of making a sale. Here's a
breakdown of what the code does: */
var Venta = require('../models/ventas.model');

var DetalleVenta = require('../models/detalles_ventas.model');

var Producto = require('../models/productos.model');

exports.vender = function _callee2(req, res) {
  var _req$body, id_usuario, productos, id_cliente, totalVenta, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, _ret, ventaResult, detalles, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _loop2, _iterator2, _step2;

  return regeneratorRuntime.async(function _callee2$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body = req.body, id_usuario = _req$body.id_usuario, productos = _req$body.productos, id_cliente = _req$body.id_cliente;

          if (!(!Array.isArray(productos) || productos.length === 0)) {
            _context4.next = 3;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            error: "No se enviaron productos"
          }));

        case 3:
          _context4.prev = 3;
          totalVenta = 0;
          /* This part of the code is responsible for checking the stock availability for each product in the
          `productos` array and calculating the total sale amount. Here's a breakdown of what it does: */

          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context4.prev = 8;

          _loop = function _loop() {
            var producto, productoData;
            return regeneratorRuntime.async(function _loop$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    producto = _step.value;
                    _context2.next = 3;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      Producto.getById(producto.id_producto, function (err, result) {
                        if (err || result.length === 0) {
                          return reject("Producto no encontrado");
                        }

                        resolve(result[0]);
                      });
                    }));

                  case 3:
                    productoData = _context2.sent;

                    if (!(producto.cantidad > productoData.stock)) {
                      _context2.next = 6;
                      break;
                    }

                    return _context2.abrupt("return", {
                      v: res.status(400).json({
                        error: "Stock insuficiente para el producto ".concat(productoData.nombre_producto)
                      })
                    });

                  case 6:
                    totalVenta += producto.precio_venta * producto.cantidad;

                  case 7:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          };

          _iterator = productos[Symbol.iterator]();

        case 11:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context4.next = 20;
            break;
          }

          _context4.next = 14;
          return regeneratorRuntime.awrap(_loop());

        case 14:
          _ret = _context4.sent;

          if (!(_typeof(_ret) === "object")) {
            _context4.next = 17;
            break;
          }

          return _context4.abrupt("return", _ret.v);

        case 17:
          _iteratorNormalCompletion = true;
          _context4.next = 11;
          break;

        case 20:
          _context4.next = 26;
          break;

        case 22:
          _context4.prev = 22;
          _context4.t0 = _context4["catch"](8);
          _didIteratorError = true;
          _iteratorError = _context4.t0;

        case 26:
          _context4.prev = 26;
          _context4.prev = 27;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 29:
          _context4.prev = 29;

          if (!_didIteratorError) {
            _context4.next = 32;
            break;
          }

          throw _iteratorError;

        case 32:
          return _context4.finish(29);

        case 33:
          return _context4.finish(26);

        case 34:
          _context4.next = 36;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            Venta.create({
              id_usuario: id_usuario,
              total: totalVenta,
              id_cliente: id_cliente
            }, function (err, result) {
              if (err) {
                return reject(err);
              }

              resolve(result);
            });
          }));

        case 36:
          ventaResult = _context4.sent;
          _context4.next = 39;
          return regeneratorRuntime.awrap(Promise.all(productos.map(function _callee(prod) {
            var productoData, gananciaUnitaria, gananciaTotal;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      Producto.getById(prod.id_producto, function (err, result) {
                        if (err || result.length === 0) {
                          return reject("Producto no encontrado");
                        }

                        resolve(result[0]);
                      });
                    }));

                  case 2:
                    productoData = _context.sent;
                    gananciaUnitaria = prod.precio_venta - productoData.precio_compra;
                    gananciaTotal = gananciaUnitaria * prod.cantidad;
                    return _context.abrupt("return", {
                      id_venta: ventaResult.insertId,
                      id_producto: prod.id_producto,
                      cantidad: prod.cantidad,
                      precio_unitario: prod.precio_venta,
                      subtotal: prod.precio_venta * prod.cantidad,
                      ganancia_unitaria: gananciaUnitaria,
                      ganancia_total: gananciaTotal
                    });

                  case 6:
                  case "end":
                    return _context.stop();
                }
              }
            });
          })));

        case 39:
          detalles = _context4.sent;
          _context4.next = 42;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            DetalleVenta.create(detalles, function (err) {
              if (err) {
                return reject(err);
              }

              resolve();
            });
          }));

        case 42:
          /* This part of the code is responsible for updating the stock levels of each product after a
          successful sale. Here's a breakdown of what it does: */
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context4.prev = 45;

          _loop2 = function _loop2() {
            var producto;
            return regeneratorRuntime.async(function _loop2$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    producto = _step2.value;
                    _context3.next = 3;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      Producto.reducirStock(producto.id_producto, producto.cantidad, function (err) {
                        if (err) {
                          return reject(err);
                        }

                        resolve();
                      });
                    }));

                  case 3:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          };

          _iterator2 = productos[Symbol.iterator]();

        case 48:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context4.next = 54;
            break;
          }

          _context4.next = 51;
          return regeneratorRuntime.awrap(_loop2());

        case 51:
          _iteratorNormalCompletion2 = true;
          _context4.next = 48;
          break;

        case 54:
          _context4.next = 60;
          break;

        case 56:
          _context4.prev = 56;
          _context4.t1 = _context4["catch"](45);
          _didIteratorError2 = true;
          _iteratorError2 = _context4.t1;

        case 60:
          _context4.prev = 60;
          _context4.prev = 61;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 63:
          _context4.prev = 63;

          if (!_didIteratorError2) {
            _context4.next = 66;
            break;
          }

          throw _iteratorError2;

        case 66:
          return _context4.finish(63);

        case 67:
          return _context4.finish(60);

        case 68:
          return _context4.abrupt("return", res.json({
            message: "Venta realizada con éxito y stock actualizado"
          }));

        case 71:
          _context4.prev = 71;
          _context4.t2 = _context4["catch"](3);
          return _context4.abrupt("return", res.status(500).json({
            error: "Ocurrió un error al procesar la venta"
          }));

        case 74:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[3, 71], [8, 22, 26, 34], [27,, 29, 33], [45, 56, 60, 68], [61,, 63, 67]]);
};