/* This code snippet is setting up routes for handling different HTTP requests related to products in a
Node.js application using Express framework. Here's a breakdown of what each part does: */
const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productos.controller');

// Rutas para productos
router.get('/productos', productosController.getProductos);              
router.get('/productos/:id', productosController.getProductoById);        
router.post('/productos', productosController.createProducto);            
router.put('/productos/:id', productosController.updateProducto);       
router.delete('/productos/:id', productosController.deleteProducto);    

// Ruta de búsqueda de productos
router.get("/buscar", productosController.buscarProducto);               


module.exports = router;
