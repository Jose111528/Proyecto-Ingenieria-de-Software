/* This JavaScript code defines a module named `DetalleVenta` that contains methods for interacting
with a database to handle details of sales transactions. Here's a breakdown of what the code does: */
const connection = require('../config/db');

const DetalleVenta = {
  // Obtener los detalles de una venta por su ID
  getByVentaId: (id_venta, callback) => {
    const sql = `
      SELECT dv.*, p.nombre_producto
      FROM detalle_ventas dv
      JOIN productos p ON dv.id_producto = p.id_producto
      WHERE dv.id_venta = ?
    `;
    connection.query(sql, [id_venta], (err, results) => {
      if (err) {
      
        return callback(err, null);
      }
      callback(null, results);  // Retorna los resultados
    });
  },

  // Crear un nuevo detalle de venta
  create: (detalles, callback) => {
    // Usamos un solo query para insertar múltiples detalles si es necesario
    const sql = `
      INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario, subtotal, ganancia_unitaria, ganancia_total)
      VALUES ?
    `;
    
    // `detalles` es un array de objetos, por lo que transformamos en un array de valores
    const values = detalles.map(detalle => [
      detalle.id_venta,
      detalle.id_producto,
      detalle.cantidad,
      detalle.precio_unitario,
      detalle.subtotal,
      detalle.ganancia_unitaria,
      detalle.ganancia_total
    ]);

    

    connection.query(sql, [values], (err, result) => {
    
      if (err) {
      
        return callback(err, null);
      }
    
      callback(null, result);  
    });
  }
};

module.exports = DetalleVenta;
