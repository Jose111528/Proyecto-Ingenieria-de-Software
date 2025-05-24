"use strict";

var Distribuidores = require('../models/distribuidor.model');
/**
 * Obtiene todos los distribuidores.
 * 
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP que envía los datos.
 * @returns {Object} Lista de distribuidores en formato JSON.
 */


exports.getDistribuidores = function _callee(req, res) {
  var results;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Distribuidores.getAll());

        case 3:
          results = _context.sent;
          res.json(results);
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            error: _context.t0.message
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};
/**
 * Crea un nuevo distribuidor.
 * 
 * @param {Object} req - Objeto de solicitud HTTP que contiene los datos del nuevo distribuidor.
 * @param {Object} res - Objeto de respuesta HTTP con el mensaje de éxito.
 * @returns {Object} Mensaje de éxito con los detalles del distribuidor creado.
 */


exports.createDistribuidores = function _callee2(req, res) {
  var results;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Distribuidores.create(req.body));

        case 3:
          results = _context2.sent;
          res.json({
            message: "Distribuidor creado",
            nombre_distribuidor: req.body.nombre_distribuidor
          });
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            error: _context2.t0.message
          });

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};
/**
 * Actualiza un distribuidor existente.
 * 
 * @param {Object} req - Objeto de solicitud HTTP con el ID del distribuidor y los nuevos datos.
 * @param {Object} res - Objeto de respuesta HTTP con el mensaje de éxito.
 * @returns {Object} Mensaje de éxito o error si no se encuentra el distribuidor.
 */


exports.updateDistribuidores = function _callee3(req, res) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Distribuidores.update(req.params.id, req.body));

        case 3:
          res.json({
            message: "Distribuidor actualizado"
          });
          _context3.next = 9;
          break;

        case 6:
          _context3.prev = 6;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            error: _context3.t0.message
          });

        case 9:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 6]]);
};

exports.deleteDistribuidores = function _callee4(req, res) {
  var id, resultado;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          id = parseInt(req.params.id);
          _context4.next = 4;
          return regeneratorRuntime.awrap(Distribuidores["delete"](id));

        case 4:
          resultado = _context4.sent;

          if (!(resultado.affectedRows === 0)) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            error: 'Distribuidor no encontrado'
          }));

        case 7:
          res.json({
            message: 'Distribuidor eliminado correctamente'
          });
          _context4.next = 14;
          break;

        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](0);
          console.error('Error al eliminar distribuidor:', _context4.t0);
          res.status(500).json({
            error: _context4.t0.message
          });

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.getMarcasPorDistribuidor = function _callee5(req, res) {
  var nombreDistribuidor, marcas;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          nombreDistribuidor = req.params.nombre;
          _context5.prev = 1;
          _context5.next = 4;
          return regeneratorRuntime.awrap(Distribuidores.getMarcasByDistribuidor(nombreDistribuidor));

        case 4:
          marcas = _context5.sent;

          if (!(marcas.length === 0)) {
            _context5.next = 7;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: 'Este distribuidor no tiene marcas asociadas'
          }));

        case 7:
          res.json(marcas);
          _context5.next = 14;
          break;

        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](1);
          console.error('Error al obtener marcas por distribuidor:', _context5.t0);
          res.status(500).send('Error al obtener marcas por distribuidor');

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 10]]);
};