/* This JavaScript code defines a set of functions that handle CRUD operations (Create, Read, Update,
Delete) for a product entity in a Node.js application. Here's a breakdown of what each function
does: */
const Producto = require('../models/productos.model');

exports.getProductos = (req, res) => {
    Producto.getAll((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        console.log(results);
        res.json(results);
    });
};

exports.getProductoById = (req, res) => {
    const { id } = req.params;
    Producto.getById(id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.json(results[0]);
    });
};

exports.createProducto = (req, res) => {
    const { nombre_producto, descripcion, precio_compra, precio_venta, codigo_barras, stock, codigo_producto,stock_minimo, id_distribuidor_marca } = req.body;

 
    if (!nombre_producto || !precio_venta || !codigo_barras) {
        return res.status(400).json({ error: "Faltan campos obligatorios: nombre, precio de venta o código de barras" });
    }

    
    const newProducto = { nombre_producto, descripcion, precio_compra, precio_venta, codigo_barras, stock, codigo_producto, stock_minimo, id_distribuidor_marca };

    Producto.create(newProducto, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Producto creado", id: results.insertId });
    });
};

exports.updateProducto = (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    Producto.getById(id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        
        if (!updateData.nombre_producto || !updateData.precio_venta || !updateData.codigo_barras) {
            return res.status(400).json({ error: "Faltan campos obligatorios: nombre, precio de venta o código de barras" });
        }

        Producto.update(id, updateData, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            // Verificar cuántas filas fueron afectadas
            if (results.affectedRows === 0) {
                return res.status(400).json({ message: "No se realizaron cambios, los datos ya están actualizados" });
            }

            res.json({ message: "Producto actualizado" });
        });
    });
};

exports.deleteProducto = (req, res) => {
    const { id } = req.params;

    // Verificar que el producto existe antes de eliminar
    Producto.getById(id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        Producto.delete(id, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Producto eliminado" });
        });
    });
};

exports.buscarProducto = (req, res) => {
    const query = req.query.query || "";
    Producto.buscarProducto(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Error en la búsqueda" });
        res.json(results);
    });
};



