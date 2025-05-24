const connection = require('../config/db');



// MARGEN NETO detalle por producto
exports.getMargenPorProducto = (req, res) => {
  const { desde, hasta } = req.query;
  const query = `
    SELECT 
      p.nombre_producto,
      SUM(dv.cantidad) AS total_unidades,
      SUM(dv.precio_unitario * dv.cantidad) AS ingresos,
      SUM(p.precio_compra * dv.cantidad) AS costos,
      SUM((dv.precio_unitario - p.precio_compra) * dv.cantidad) AS margen
    FROM ventas v
    JOIN detalle_ventas dv ON v.id_venta = dv.id_venta
    JOIN productos p ON dv.id_producto = p.id_producto
    WHERE v.fecha_venta BETWEEN ? AND ?
    GROUP BY p.nombre_producto
    ORDER BY margen DESC
  `;
  connection.query(query, [desde, hasta], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al consultar margen por producto' });
    res.json(results);
  });
};




//  STOCK BAJO detalle
exports.getStockCriticoDetalle = (req, res) => {
  const query = `
    SELECT 
      p.id_producto,
      p.codigo_producto, 
      p.nombre_producto, 
      p.stock, 
      p.stock_minimo, 
      d.nombre_distribuidor
    FROM productos p
    JOIN distribuidores_marcas dm ON p.id_distribuidor_marca = dm.id_distribuidor_marca
    JOIN distribuidores d ON dm.id_distribuidor = d.id_distribuidor
    WHERE p.stock < p.stock_minimo
    ORDER BY d.nombre_distribuidor, p.nombre_producto ASC
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error al consultar productos críticos:", err);
      return res.status(500).json({ error: 'Error al consultar productos críticos' });
    }


    res.json(results);
  });
};



//  PRODUCTOS TOP
exports.getTopProductos = (req, res) => {
  const { desde, hasta } = req.query;
  const query = `
    SELECT p.nombre_producto, SUM(dv.cantidad) AS vendidos, SUM(dv.precio_unitario * dv.cantidad) AS ingresos
    FROM detalle_ventas dv
    JOIN ventas v ON v.id_venta = dv.id_venta
    JOIN productos p ON dv.id_producto = p.id_producto
    WHERE v.fecha_venta BETWEEN ? AND ?
    GROUP BY p.nombre_producto
    ORDER BY vendidos DESC
    LIMIT 10
  `;
  connection.query(query, [desde, hasta], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al consultar productos top' });
    res.json(results);
  });
};


exports.getHistorialVentas = (req, res) => {
  const { desde, hasta } = req.query;
  const query = `
    SELECT DATE(fecha_venta) AS fecha, SUM(total) AS total_dia
    FROM ventas
    WHERE fecha_venta BETWEEN ? AND ?
    GROUP BY DATE(fecha_venta)
    ORDER BY fecha_venta ASC
  `;
  connection.query(query, [desde, hasta], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al consultar historial de ventas' });
    res.json(results);
  });
};

// 7. CLIENTES nuevos vs recurrentes
exports.getClientesNuevosVsRecurrentes = (req, res) => {
  const { desde, hasta } = req.query;
  const query = `
    SELECT 
      COUNT(DISTINCT CASE WHEN primera_compra BETWEEN ? AND ? THEN id_cliente END) AS nuevos,
      COUNT(DISTINCT CASE WHEN primera_compra < ? THEN id_cliente END) AS recurrentes
    FROM (
      SELECT id_cliente, MIN(fecha_venta) AS primera_compra
      FROM ventas
      GROUP BY id_cliente
    ) sub
  `;
  connection.query(query, [desde, hasta, desde], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al consultar clientes' });
    res.json(results[0]);
  });
};



//  VENDEDORES - rendimiento
exports.getRendimientoVendedores = (req, res) => {
  const { desde, hasta } = req.query;
  const query = `
    SELECT u.nombre, SUM(v.total) AS total_vendido, COUNT(v.id_venta) AS ventas
    FROM ventas v
    JOIN usuarios u ON v.id_usuario = u.id_usuario
    WHERE v.fecha_venta BETWEEN ? AND ?
    GROUP BY u.id_usuario
    ORDER BY total_vendido DESC
  `;
  connection.query(query, [desde, hasta], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al consultar rendimiento de vendedores' });
    res.json(results);
  });
};


//  VENTAS SEMANALES
exports.getVentasSemanales = (req, res) => {
  const { desde, hasta } = req.query;
  const query = `
    SELECT WEEK(fecha_venta) AS semana, SUM(total) AS total_semanal
    FROM ventas
    WHERE fecha_venta BETWEEN ? AND ?
    GROUP BY semana
    ORDER BY semana DESC
  `;
  connection.query(query, [desde, hasta], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al consultar ventas semanales' });
    res.json(results);
  });
};

exports.getValorTotalInventario = (req, res) => {
  const query = `
    SELECT 
      SUM(stock * precio_venta) AS valor_inventario,
      SUM(stock * (precio_venta - precio_compra)) AS ganancia_inventario
    FROM productos
  `;

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al consultar valor del inventario' });
    }
    res.json(results[0]);
  });
};

//  PRODUCTOS CON MAYOR STOCK
exports.getProductosMayorStock = (req, res) => {
  const query = `
    SELECT id_producto, nombre_producto, stock
    FROM productos
    ORDER BY stock DESC
    LIMIT 10
  `;
  connection.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al consultar productos con mayor stock' });
    res.json(results);
  });
};

// RESUMEN DE VENTAS
exports.getResumenVentas = (req, res) => {
  const { desde, hasta } = req.query;

  const query = `
    SELECT 
      SUM(total) AS total_ventas,
      COUNT(id_venta) AS total_transacciones,
      AVG(total) AS promedio_venta
    FROM ventas
    WHERE fecha BETWEEN ? AND ?
  `;

  connection.query(query, [desde, hasta], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al consultar resumen de ventas' });
    }
    res.json(results[0]);
  });
};
//  VENTAS POR DÍA Y PRODUCTO
exports.getVentasPorDiaYProducto = (req, res) => {
  const { desde, hasta } = req.query;

  const query = `
    SELECT 
      DATE(v.fecha) AS dia,
      p.nombre_producto,
      SUM(dv.cantidad) AS cantidad_vendida,
      SUM(dv.precio_unitario * dv.cantidad) AS total_vendido
    FROM ventas v
    JOIN detalle_ventas dv ON v.id_venta = dv.id_venta
    JOIN productos p ON dv.id_producto = p.id_producto
    WHERE v.fecha BETWEEN ? AND ?
    GROUP BY dia, p.nombre_producto
    ORDER BY dia DESC, total_vendido DESC
  `;

  connection.query(query, [desde, hasta], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al consultar ventas por día y producto' });
    }
    res.json(results);
  });
};

exports.getDetalleVentaPorDia = (req, res) => {
  const { fecha } = req.query;

  if (!fecha) {
    return res.status(400).json({ error: 'Falta el parámetro "fecha"' });
  }

  const query = `
    SELECT 
      DATE(v.fecha_venta) AS fecha,
      p.codigo_producto AS codigo_producto,
      p.nombre_producto,
      dv.precio_unitario,
      p.precio_compra,
      dv.cantidad,
      (dv.precio_unitario * dv.cantidad) AS total_linea,
      ((dv.precio_unitario - p.precio_compra) * dv.cantidad) AS ganancia_producto,
      (
        SELECT SUM(total) 
        FROM ventas 
        WHERE DATE(fecha) = DATE(v.fecha_venta)
      ) AS total_dia
    FROM ventas v
    JOIN detalle_ventas dv ON v.id_venta = dv.id_venta
    JOIN productos p ON dv.id_producto = p.id_producto
    WHERE DATE(v.fecha_venta) = ?
    ORDER BY p.nombre_producto
  `;

  connection.query(query, [fecha], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al consultar ventas detalladas por día' });
    res.json(results);
  });
};
