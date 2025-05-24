"use strict";

/* This JavaScript code defines a module named `DistribuidoresMarcas` that contains several functions
related to managing associations between distributors and brands in a database. Here is a breakdown
of what each function does: */
var connection = require("../config/db");

var DistribuidoresMarcas = {
  getIdDistribuidoresMarcas: function getIdDistribuidoresMarcas(id_distribuidor, id_marca) {
    return new Promise(function (resolve, reject) {
      var query = "\n      SELECT id_distribuidor_marca FROM distribuidores_marcas \n      WHERE id_distribuidor = ? AND id_marca = ?";
      connection.query(query, [id_distribuidor, id_marca], function (error, results) {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  },
  verificarAsociacion: function verificarAsociacion(id_distribuidor, id_marca) {
    return new Promise(function (resolve, reject) {
      var query = "\n        SELECT id_distribuidor_marca \n        FROM distribuidores_marcas \n        WHERE id_distribuidor = ? AND id_marca = ?";
      connection.query(query, [id_distribuidor, id_marca], function (error, results) {
        if (error) {
          reject(error);
        } else {
          // Si existe, se retorna el id de la relación, si no existe, se retorna null
          resolve(results.length > 0 ? results[0] : null);
        }
      });
    });
  },
  //  Nueva función para insertar la asociación
  insertDistribuidorMarca: function insertDistribuidorMarca(id_distribuidor, id_marca) {
    return new Promise(function (resolve, reject) {
      var query = "INSERT INTO distribuidores_marcas (id_distribuidor, id_marca) VALUES (?, ?)";
      connection.query(query, [id_distribuidor, id_marca], function (error, results) {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
  getAllDistribuidoresMarcas: function getAllDistribuidoresMarcas() {
    return new Promise(function (resolve, reject) {
      var query = "\n       SELECT \n  dm.id_distribuidor,\n  dm.id_marca,\n  d.nombre_distribuidor,\n  m.nombre_marca\nFROM \n  distribuidores_marcas dm\nJOIN \n  distribuidores d ON d.id_distribuidor = dm.id_distribuidor\nJOIN \n  marca m ON m.id_marca = dm.id_marca;\n\n";
      connection.query(query, function (error, results) {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
  deleteDistribuidorMarca: function deleteDistribuidorMarca(id_distribuidor, id_marca) {
    return new Promise(function (resolve, reject) {
      var query = "\n        DELETE FROM distribuidores_marcas\n        WHERE id_distribuidor = ? AND id_marca = ?";
      connection.query(query, [id_distribuidor, id_marca], function (error, results) {
        if (error) {
          reject(error);
        } else {
          // Si la eliminación es exitosa, se devuelve el número de filas afectadas
          resolve(results.affectedRows > 0);
        }
      });
    });
  }
};
module.exports = DistribuidoresMarcas;