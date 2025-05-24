// Modelo Distribuidores (distribuidores.model.js)
const connection = require('../config/db');

const Distribuidor = {
    // Obtener todos los distribuidores
    getAll: () => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM distribuidores', (error, results) => {
                if (error) {
                    reject(error); 
                } else {
                    resolve(results);  
                }
            });
        });
    },

    getMarcasByDistribuidor: (nombre_distribuidor) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT 
                            distribuidores_marcas.id_distribuidor_marca, 
                            marca.id_marca, 
                            marca.nombre_marca
                           FROM marca 
                           JOIN distribuidores_marcas 
                           ON marca.id_marca = distribuidores_marcas.id_marca 
                           JOIN distribuidores 
                           ON distribuidores.id_distribuidor = distribuidores_marcas.id_distribuidor
                           WHERE distribuidores.nombre_distribuidor = ?`;
    
            connection.query(query, [nombre_distribuidor], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },
    
    
    // Obtener un distribuidor por nombre
    getById: (id_distribuidores) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM distribuidores WHERE id_distribuidor = ?', [id_distribuidores], (error, results) => {
                if (error) {
                    reject(error);  // Rechaza la promesa si hay un error
                } else {
                    resolve(results);  // Resuelve la promesa si la consulta es exitosa
                }
            });
        });
    },
    
    // Crear un nuevo distribuidor
    create: (distribuidor) => {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO distribuidores SET ?', distribuidor, (error, results) => {
                if (error) {
                    reject(error);  
                } else {
                    resolve(results);  
                }
            });
        });
    },

    // Actualizar un distribuidor por ID
    update: (id, distribuidor) => {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE distribuidores SET ? WHERE id_distribuidor = ?', [distribuidor, id], (error, results) => {
                if (error) {
                    reject(error);  
                } else {
                    resolve(results);  
                }
            });
        });
    },

    // Eliminar un distribuidor por ID
    delete: (id) => {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM distribuidores WHERE id_distribuidor = ?', [id], (error, results) => {
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
