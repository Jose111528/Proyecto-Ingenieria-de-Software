"use strict";

// Modelo Distribuidores (distribuidores.model.js)
var connection = require('../config/db');

var Distribuidor = {
  // Obtener todos los distribuidores
  getAll: function getAll() {
    return new Promise(function (resolve, reject) {
      connection.query('SELECT * FROM distribuidores', function (error, results) {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
  getMarcasByDistribuidor: function getMarcasByDistribuidor(nombre_distribuidor) {
    return new Promise(function (resolve, reject) {
      var query = "SELECT \n                            distribuidores_marcas.id_distribuidor_marca, \n                            marca.id_marca, \n                            marca.nombre_marca\n                           FROM marca \n                           JOIN distribuidores_marcas \n                           ON marca.id_marca = distribuidores_marcas.id_marca \n                           JOIN distribuidores \n                           ON distribuidores.id_distribuidor = distribuidores_marcas.id_distribuidor\n                           WHERE distribuidores.nombre_distribuidor = ?";
      connection.query(query, [nombre_distribuidor], function (error, results) {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
  // Obtener un distribuidor por nombre
  getById: function getById(id_distribuidores) {
    return new Promise(function (resolve, reject) {
      connection.query('SELECT * FROM distribuidores WHERE id_distribuidor = ?', [id_distribuidores], function (error, results) {
        if (error) {
          reject(error); // Rechaza la promesa si hay un error
        } else {
          resolve(results); // Resuelve la promesa si la consulta es exitosa
        }
      });
    });
  },
  // Crear un nuevo distribuidor
  create: function create(distribuidor) {
    return new Promise(function (resolve, reject) {
      connection.query('INSERT INTO distribuidores SET ?', distribuidor, function (error, results) {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
  // Actualizar un distribuidor por ID
  update: function update(id, distribuidor) {
    return new Promise(function (resolve, reject) {
      connection.query('UPDATE distribuidores SET ? WHERE id_distribuidor = ?', [distribuidor, id], function (error, results) {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
  // Eliminar un distribuidor por ID
  "delete": function _delete(id) {
    return new Promise(function (resolve, reject) {
      connection.query('DELETE FROM distribuidores WHERE id_distribuidor = ?', [id], function (error, results) {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
};
module.exports = Distribuidor;