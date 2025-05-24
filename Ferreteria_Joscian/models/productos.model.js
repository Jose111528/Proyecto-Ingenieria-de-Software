/* The above code is a JavaScript module that defines a set of functions related to managing products
in a database. Here is a summary of what each function does: */
const connection = require('../config/db');

const Producto = {
  getAll: (callback) => {
    const query = `
      SELECT 
        p.id_producto, 
        p.nombre_producto, 
        p.descripcion, 
        p.precio_compra, 
        p.precio_venta, 
        p.codigo_barras, 
        p.stock, 
        p.codigo_producto,
        p.stock_minimo,
        m.nombre_marca, 
        d.nombre_distribuidor
      FROM productos p
      LEFT JOIN distribuidores_marcas dm ON p.id_distribuidor_marca = dm.id_distribuidor_marca
      LEFT JOIN marca m ON dm.id_marca = m.id_marca
      LEFT JOIN distribuidores d ON dm.id_distribuidor = d.id_distribuidor
    `;
    
    connection.query(query, (err, results) => {
      if (err) {
      
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  getById: (id, callback) => {
    const query = `
      SELECT 
        p.id_producto, 
        p.nombre_producto, 
        p.descripcion, 
        p.precio_compra, 
        p.precio_venta, 
        p.codigo_barras, 
        p.stock, 
        p.codigo_producto,
        p.stock_minimo,
        m.nombre_marca, 
        d.nombre_distribuidor
      FROM productos p
      LEFT JOIN distribuidores_marcas dm ON p.id_distribuidor_marca = dm.id_distribuidor_marca
      LEFT JOIN marca m ON dm.id_marca = m.id_marca
      LEFT JOIN distribuidores d ON dm.id_distribuidor = d.id_distribuidor
      WHERE p.id_producto = ?
    `;
    
    connection.query(query, [id], (err, results) => {
      if (err) {
       
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  create: (producto, callback) => {
    // Validación de los datos
    if (!producto.nombre_producto || !producto.precio_venta || !producto.codigo_barras) {
      return callback(new Error('Faltan campos obligatorios: nombre, precio de venta o código de barras'), null);
    }
    const checkCodigoBarrasQuery = `SELECT * FROM productos WHERE codigo_barras = ?`;

    connection.query(checkCodigoBarrasQuery, [producto.codigo_barras], (err, results) => {
      if (err) {
        return callback(err, null);
      }
  
      if (results.length > 0) {
        return callback(new Error('El código de barras ya está registrado'), null);
      }
    
  
    const query = `
      INSERT INTO productos 
      (nombre_producto, descripcion, precio_compra, precio_venta, codigo_barras, stock, codigo_producto, stock_minimo, id_distribuidor_marca)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      producto.nombre_producto,
      producto.descripcion,
      producto.precio_compra,
      producto.precio_venta,
      producto.codigo_barras,
      producto.stock,
      producto.codigo_producto,
      producto.stock_minimo,
      producto.id_distribuidor_marca,
      
    ];

    connection.query(query, values, (err, result) => {
      if (err) {
      
        return callback(err, null);
      }
      callback(null, result);
    });
  });
  },

  update: (id, producto, callback) => {
    // Validación de los datos
    if (!producto.nombre_producto || !producto.precio_venta || !producto.codigo_barras) {
      return callback(new Error('Faltan campos obligatorios: nombre, precio de venta o código de barras'), null);
    }

    const query = `
      UPDATE productos SET 
        nombre_producto = ?, 
        descripcion = ?, 
        precio_compra = ?, 
        precio_venta = ?, 
        codigo_barras = ?, 
        stock = ?, 
        codigo_producto = ?, 
        stock_minimo = ?,
        id_distribuidor_marca = ? 
      WHERE id_producto = ?
    `;
    
    const values = [
      producto.nombre_producto,
      producto.descripcion,
      producto.precio_compra,
      producto.precio_venta,
      producto.codigo_barras,
      producto.stock,
      producto.codigo_producto, 
      producto.stock_minimo,
      producto.id_distribuidor_marca,
      id
    ];

    connection.query(query, values, (err, result) => {
      if (err) {
        console.error("Error al actualizar producto:", err);
        return callback(err, null);
      }
     
      callback(null, result);
    });
  },

  delete: (id, callback) => {
    connection.query('DELETE FROM productos WHERE id_producto = ?', [id], (err, result) => {
      if (err) {
        console.error("Error al eliminar producto:", err);
        return callback(err, null);
      }
      callback(null, result);
    });
  },

  buscarProducto: (query, callback) => {
    const sql = `
      SELECT 
        p.id_producto, 
        p.nombre_producto, 
        p.descripcion, 
        p.precio_venta, 
        p.codigo_barras, 
        p.stock, 
        p.codigo_producto,
        p.stock_minimo
      FROM productos p
      WHERE p.codigo_barras LIKE ? 
        OR p.nombre_producto LIKE ? 
        OR p.codigo_producto LIKE ?
      LIMIT 10
    `;
    
    const valores = [`%${query}%`, `%${query}%`, `%${query}%`];
    
    connection.query(sql, valores, (err, results) => {
      if (err) {
        console.error("Error al buscar producto:", err);
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  reducirStock: (id_producto, cantidad, callback) => {
    // Comprobar el stock disponible antes de reducirlo
    const checkStockQuery = `SELECT stock FROM productos WHERE id_producto = ?`;
    
    connection.query(checkStockQuery, [id_producto], (err, result) => {
      if (err) {
        console.error("Error al verificar stock:", err);
        return callback(err, null);
      }
      
      const stockActual = result[0].stock;
      if (stockActual < cantidad) {
        return callback(new Error('No hay suficiente stock disponible'), null);
      }

      // Si el stock es suficiente, actualizar el stock
      const sql = `UPDATE productos SET stock = stock - ? WHERE id_producto = ?`;
      connection.query(sql, [cantidad, id_producto], (err, result) => {
        if (err) {
          console.error("Error al reducir stock:", err);
          return callback(err, null);
        }
        callback(null, result);
      });
    });
  }
};

module.exports = Producto;
