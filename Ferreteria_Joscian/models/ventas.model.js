const connection = require('../config/db');

const Venta = {
  // Obtener todas las ventas
  getAll: (callback) => {
    const sql = `
      SELECT v.*, u.nombre AS nombre_usuario, c.nombre_cliente
      FROM ventas v
      LEFT JOIN usuarios u ON v.id_usuario = u.id_usuario
      LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
      ORDER BY v.fecha_venta DESC
    `;
    connection.query(sql, callback);
  },

  // Obtener una venta por su ID
  getById: (id, callback) => {
    const sql = `SELECT * FROM ventas WHERE id_venta = ?`;
    connection.query(sql, [id], callback);
  },

  // Crear una nueva venta
  create: (venta, callback) => {
    const sql = `
      INSERT INTO ventas (id_usuario, fecha_venta, total, id_cliente)
      VALUES (?, NOW(), ?, ?)
    `;
    const values = [venta.id_usuario, venta.total, venta.id_cliente];
  
    
    connection.query(sql, values, (err, result) => {
      if (err) {
    
        return callback(err, null);
      }
  
      callback(null, result);
    });
  }
}  

module.exports = Venta;
