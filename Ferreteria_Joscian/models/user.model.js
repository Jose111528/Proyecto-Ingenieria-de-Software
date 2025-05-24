const connection = require('../config/db');  

const User = {
  // Crear un nuevo usuario
  create: (user) => {
    return new Promise((resolve, reject) => {
      const { username, password, role, telefono } = user;
      const query = 'INSERT INTO usuarios (nombre, contraseña, role, telefono) VALUES (?, ?, ?, ?)';
      connection.query(query, [username, password, role, telefono], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },

  // Obtener un usuario por su nombre de usuario
  getByUsername: (username) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM usuarios WHERE nombre = ?';
      connection.query(query, [username], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results); 
        }
      });
    });
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM usuarios WHERE id_usuario = ?';
      connection.query(query, [id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
  deleteById: (id) => {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM usuarios WHERE id_usuario = ?';
      connection.query(query, [id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
  

  getAllWorkers: async () => {
    return new Promise((resolve, reject) => {
     
      const query = 'SELECT id_usuario, nombre,contraseña,role,telefono FROM usuarios WHERE role = \'trabajador\'';
      connection.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
  

};

module.exports = User;
