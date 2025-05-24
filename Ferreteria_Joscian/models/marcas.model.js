/* This code snippet is defining a module named `Marca` that contains functions to interact with a
database table named `marca`. Here's a breakdown of what each function does: */
const connection = require('../config/db');

const Marca = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM marca', (error, results) => {
                if (error) {
                    reject(error);  
                } else {
                    resolve(results); 
                }
            });
        });
    },

    getByName: (nombre_marca) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM marca WHERE nombre_marca= ?', [nombre_marca], (error, results) => {
                if (error) {
                    reject(error);  
                } else {
                    resolve(results); 
                }
            });
        });
    },

    create: (marca) => {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO marca SET ?', marca, (error, results) => {
                if (error) {
                    reject(error); 
                } else {
                    resolve(results); 
                }
            });
        });
    },

    update: (id, marca) => {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE marca SET ? WHERE id_marca = ?', [marca, id], (error, results) => {
                if (error) {
                    reject(error);  
                } else {
                    resolve(results); 
                }
            });
        });
    },

    delete: (id) => {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM marca WHERE id_marca = ?', [id], (error, results) => {
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
