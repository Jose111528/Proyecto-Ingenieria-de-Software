"use strict";

// Modelo Distribuidores (distribuidores.model.js)
var connection = require('../config/db');

var Distribuidor = {
  // Obtener todos los distribuidores
  getAll: function getAll() {
    return new Promise(function (resolve, reject) {
      connection.query('SELECT * FROM distribuidores', function (error, results) {
        if (error) {
          reject(error); // Rechaza la promesa si hay un error
        } else {
          resolve(results); // Resuelve la promesa si la consulta es exitosa
        }
      });
    });
  },
  // Obtener un distribuidor por nombre
  getById: function getById(id_distribuidores) {
    return new Promise(function (resolve, reject) {
      connection.query('SELECT * FROM distribuidores WHERE id_distribuidores = ?', [id_distribuidores], function (error, results) {
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
          reject(error); // Rechaza la promesa si hay un error
        } else {
          resolve(results); // Resuelve la promesa si la consulta es exitosa
        }
      });
    });
  },
  // Actualizar un distribuidor por ID
  update: function update(id, distribuidor) {
    return new Promise(function (resolve, reject) {
      connection.query('UPDATE distribuidores SET ? WHERE id_distribuidores = ?', [distribuidor, id], function (error, results) {
        if (error) {
          reject(error); // Rechaza la promesa si hay un error
        } else {
          resolve(results); // Resuelve la promesa si la consulta es exitosa
        }
      });
    });
  },
  // Eliminar un distribuidor por ID
  "delete": function _delete(id) {
    return new Promise(function (resolve, reject) {
      connection.query('DELETE FROM distribuidores WHERE id_distribuidores = ?', [id], function (error, results) {
        if (error) {
          reject(error); // Rechaza la promesa si hay un error
        } else {
          resolve(results); // Resuelve la promesa si la consulta es exitosa
        }
      });
    });
  }
};
module.exports = Distribuidor;