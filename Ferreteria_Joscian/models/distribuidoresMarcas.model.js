/* This JavaScript code defines a module named `DistribuidoresMarcas` that contains several functions
related to managing associations between distributors and brands in a database. Here is a breakdown
of what each function does: */
const connection = require("../config/db");

const DistribuidoresMarcas = {

  getIdDistribuidoresMarcas: (id_distribuidor, id_marca) => {
    return new Promise((resolve, reject) => {
      const query = `
      SELECT id_distribuidor_marca FROM distribuidores_marcas 
      WHERE id_distribuidor = ? AND id_marca = ?`;
      connection.query(query, [id_distribuidor, id_marca], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  },


  verificarAsociacion: (id_distribuidor, id_marca) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT id_distribuidor_marca 
        FROM distribuidores_marcas 
        WHERE id_distribuidor = ? AND id_marca = ?`;
      connection.query(query, [id_distribuidor, id_marca], (error, results) => {
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
  insertDistribuidorMarca: (id_distribuidor, id_marca) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO distribuidores_marcas (id_distribuidor, id_marca) VALUES (?, ?)`;
      connection.query(query, [id_distribuidor, id_marca], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      })
    });
  },

  getAllDistribuidoresMarcas: () => {
    return new Promise((resolve, reject) => {
      const query = `
       SELECT 
  dm.id_distribuidor,
  dm.id_marca,
  d.nombre_distribuidor,
  m.nombre_marca
FROM 
  distribuidores_marcas dm
JOIN 
  distribuidores d ON d.id_distribuidor = dm.id_distribuidor
JOIN 
  marca m ON m.id_marca = dm.id_marca;

`;
      connection.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },

  deleteDistribuidorMarca: (id_distribuidor, id_marca) => {
    return new Promise((resolve, reject) => {
      const query = `
        DELETE FROM distribuidores_marcas
        WHERE id_distribuidor = ? AND id_marca = ?`;
      connection.query(query, [id_distribuidor, id_marca], (error, results) => {
        if (error) {
          reject(error);
        } else {
          // Si la eliminación es exitosa, se devuelve el número de filas afectadas
          resolve(results.affectedRows > 0);
        }
      });
    });
  },

};

module.exports = DistribuidoresMarcas;
