/* This JavaScript code defines a function `vender` that handles the process of making a sale. Here's a
breakdown of what the code does: */

const Venta = require('../models/ventas.model');
const DetalleVenta = require('../models/detalles_ventas.model');
const Producto = require('../models/productos.model');

exports.vender = async (req, res) => {
  const { id_usuario, productos, id_cliente } = req.body;
  
  if (!Array.isArray(productos) || productos.length === 0) {
   
    return res.status(400).json({ error: "No se enviaron productos" });
  }

  try {
    let totalVenta = 0;

   /* This part of the code is responsible for checking the stock availability for each product in the
   `productos` array and calculating the total sale amount. Here's a breakdown of what it does: */
    
    for (const producto of productos) {
      const productoData = await new Promise((resolve, reject) => {
        Producto.getById(producto.id_producto, (err, result) => {
          if (err || result.length === 0) {
          
            return reject("Producto no encontrado");
          }
          resolve(result[0]);
        });
      });

      if (producto.cantidad > productoData.stock) {
        return res.status(400).json({ error: `Stock insuficiente para el producto ${productoData.nombre_producto}` });
      }

      totalVenta += producto.precio_venta * producto.cantidad;
    }

    
    /* This part of the code is using a Promise to handle the asynchronous creation of a new sale
    record in the `Venta` model. Here's a breakdown of what it does: */
    const ventaResult = await new Promise((resolve, reject) => {
      Venta.create({ id_usuario, total: totalVenta, id_cliente }, (err, result) => {
        if (err) {
      
          return reject(err);
        }
       
        resolve(result);
      });
    });

   
 /* This part of the code is creating an array of `detalles` (details) for each product in the
 `productos` array. Here's a breakdown of what it does: */
    const detalles = await Promise.all(productos.map(async (prod) => {
      const productoData = await new Promise((resolve, reject) => {
        Producto.getById(prod.id_producto, (err, result) => {
          if (err || result.length === 0) {
            return reject("Producto no encontrado");
          }
          resolve(result[0]);
        });
      });

      const gananciaUnitaria = prod.precio_venta - productoData.precio_compra;
      const gananciaTotal = gananciaUnitaria * prod.cantidad;

      return {
        id_venta: ventaResult.insertId,
        id_producto: prod.id_producto,
        cantidad: prod.cantidad,
        precio_unitario: prod.precio_venta,
        subtotal: prod.precio_venta * prod.cantidad,
        ganancia_unitaria: gananciaUnitaria,
        ganancia_total: gananciaTotal
      };
    }));

   

   
    /* This part of the code is responsible for updating the stock levels after a successful sale.
    Here's a breakdown of what it does: */
    await new Promise((resolve, reject) => {
      DetalleVenta.create(detalles, (err) => {
        if (err) {
          
          return reject(err);
        }
      
        resolve();
      });
    });

    /* This part of the code is responsible for updating the stock levels of each product after a
    successful sale. Here's a breakdown of what it does: */
   
    for (const producto of productos) {
      await new Promise((resolve, reject) => {
        Producto.reducirStock(producto.id_producto, producto.cantidad, (err) => {
          if (err) {
           
            return reject(err);
          }
       
          resolve();
        });
      });
    }

    return res.json({ message: "Venta realizada con éxito y stock actualizado" });

  } catch (error) {
   
    return res.status(500).json({ error: "Ocurrió un error al procesar la venta" });
  }
};
