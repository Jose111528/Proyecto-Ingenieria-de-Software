"use strict";

var DistribuidoresMarcas = require("../models/distribuidoresMarcas.model");
/**
 * Verifica si existe la asociación entre un distribuidor y una marca.
 * 
 * @param {Object} req - El objeto de solicitud que contiene los parámetros `id_distribuidor` y `id_marca`.
 * @param {Object} res - El objeto de respuesta para enviar los resultados.
 * @returns {Object} Respuesta con un objeto JSON indicando si la asociación existe o no.
 */


var verificarAsociacion = function verificarAsociacion(req, res) {
  var _req$query, id_distribuidor, id_marca, asociacion;

  return regeneratorRuntime.async(function verificarAsociacion$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$query = req.query, id_distribuidor = _req$query.id_distribuidor, id_marca = _req$query.id_marca;

          if (!(!id_distribuidor || !id_marca)) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "Faltan parámetros id_distribuidor o id_marca"
          }));

        case 3:
          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap(DistribuidoresMarcas.verificarAsociacion(id_distribuidor, id_marca));

        case 6:
          asociacion = _context.sent;
          return _context.abrupt("return", res.json({
            existe: !!asociacion
          }));

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](3);
          console.error("Error al verificar la asociación:", _context.t0);
          res.status(500).json({
            error: "Error interno del servidor"
          });

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 10]]);
};
/**
 * Asocia un distribuidor con una marca si no existe una asociación previa.
 * 
 * @param {Object} req - El objeto de solicitud que contiene los parámetros `id_distribuidor` y `id_marca` en el cuerpo de la solicitud.
 * @param {Object} res - El objeto de respuesta para enviar el resultado de la asociación.
 * @returns {Object} Respuesta con un mensaje de éxito o error según el resultado.
 */


var asociarDistribuidorMarca = function asociarDistribuidorMarca(req, res) {
  var _req$body, id_distribuidor, id_marca, asociacionExistente, result;

  return regeneratorRuntime.async(function asociarDistribuidorMarca$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, id_distribuidor = _req$body.id_distribuidor, id_marca = _req$body.id_marca;

          if (!(!id_distribuidor || !id_marca)) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: "Faltan parámetros id_distribuidor o id_marca"
          }));

        case 3:
          _context2.prev = 3;
          _context2.next = 6;
          return regeneratorRuntime.awrap(DistribuidoresMarcas.verificarAsociacion(id_distribuidor, id_marca));

        case 6:
          asociacionExistente = _context2.sent;

          if (!asociacionExistente) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: "La relación ya existe entre este distribuidor y esta marca."
          }));

        case 9:
          _context2.next = 11;
          return regeneratorRuntime.awrap(DistribuidoresMarcas.insertDistribuidorMarca(id_distribuidor, id_marca));

        case 11:
          result = _context2.sent;
          res.status(201).json({
            mensaje: "Distribuidor y Marca asociados correctamente",
            id: result.insertId
          });
          _context2.next = 19;
          break;

        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](3);
          console.error("Error al asociar distribuidor con marca:", _context2.t0);
          res.status(500).json({
            error: "Error interno del servidor"
          });

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 15]]);
};
/**
 * Obtiene todas las asociaciones entre distribuidores y marcas.
 * 
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} res - El objeto de respuesta que contiene la lista de asociaciones.
 * @returns {Array} Respuesta con un array de asociaciones de distribuidores y marcas.
 */


var obtenerDistribuidoresMarcas = function obtenerDistribuidoresMarcas(req, res) {
  var distribuidoresMarcas;
  return regeneratorRuntime.async(function obtenerDistribuidoresMarcas$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(DistribuidoresMarcas.getAllDistribuidoresMarcas());

        case 3:
          distribuidoresMarcas = _context3.sent;
          res.json(distribuidoresMarcas);
          _context3.next = 11;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          console.error("Error al obtener distribuidores marcas:", _context3.t0);
          res.status(500).json({
            error: "Error interno del servidor"
          });

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
};
/**
 * Elimina la asociación entre un distribuidor y una marca.
 * 
 * @param {Object} req - El objeto de solicitud que contiene los parámetros `id_distribuidor` y `id_marca`.
 * @param {Object} res - El objeto de respuesta que indicará si la eliminación fue exitosa.
 * @returns {Object} Respuesta con un mensaje de éxito o error.
 */


var eliminarDistribuidorMarca = function eliminarDistribuidorMarca(req, res) {
  var _req$query2, id_distribuidor, id_marca, asociacionExistente, resultado;

  return regeneratorRuntime.async(function eliminarDistribuidorMarca$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$query2 = req.query, id_distribuidor = _req$query2.id_distribuidor, id_marca = _req$query2.id_marca;

          if (!(!id_distribuidor || !id_marca)) {
            _context4.next = 3;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            error: "Faltan parámetros id_distribuidor o id_marca"
          }));

        case 3:
          _context4.prev = 3;
          _context4.next = 6;
          return regeneratorRuntime.awrap(DistribuidoresMarcas.verificarAsociacion(id_distribuidor, id_marca));

        case 6:
          asociacionExistente = _context4.sent;

          if (asociacionExistente) {
            _context4.next = 9;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            error: "No se encontró la relación entre este distribuidor y esta marca."
          }));

        case 9:
          _context4.next = 11;
          return regeneratorRuntime.awrap(DistribuidoresMarcas.deleteDistribuidorMarca(id_distribuidor, id_marca));

        case 11:
          resultado = _context4.sent;
          res.status(200).json({
            mensaje: "Asociación eliminada correctamente."
          });
          _context4.next = 19;
          break;

        case 15:
          _context4.prev = 15;
          _context4.t0 = _context4["catch"](3);
          console.error("Error al eliminar la asociación:", _context4.t0);
          res.status(500).json({
            error: "Error interno del servidor"
          });

        case 19:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[3, 15]]);
};

module.exports = {
  verificarAsociacion: verificarAsociacion,
  asociarDistribuidorMarca: asociarDistribuidorMarca,
  obtenerDistribuidoresMarcas: obtenerDistribuidoresMarcas,
  eliminarDistribuidorMarca: eliminarDistribuidorMarca
};