"use strict";

/* This code snippet is defining a module named `Marca` that contains functions to interact with a
database table named `marca`. Here's a breakdown of what each function does: */
var connection = require('../config/db');

var Marca = {
  getAll: function getAll() {
    return new Promise(function (resolve, reject) {
      connection.query('SELECT * FROM marca', function (error, results) {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
  getByName: function getByName(nombre_marca) {
    return new Promise(function (resolve, reject) {
      connection.query('SELECT * FROM marca WHERE nombre_marca= ?', [nombre_marca], function (error, results) {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
  create: function create(marca) {
    return new Promise(function (resolve, reject) {
      connection.query('INSERT INTO marca SET ?', marca, function (error, results) {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
  update: function update(id, marca) {
    return new Promise(function (resolve, reject) {
      connection.query('UPDATE marca SET ? WHERE id_marca = ?', [marca, id], function (error, results) {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
  "delete": function _delete(id) {
    return new Promise(function (resolve, reject) {
      connection.query('DELETE FROM marca WHERE id_marca = ?', [id], function (error, results) {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
};
module.exports = Marca;