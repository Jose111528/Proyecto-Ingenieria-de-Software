"use strict";

var connection = require('../config/db'); // MARGEN NETO detalle por producto


exports.getMargenPorProducto = function (req, res) {
  var _req$query = req.query,
      desde = _req$query.desde,
      hasta = _req$query.hasta;
  var query = "\n    SELECT \n      p.nombre_producto,\n      SUM(dv.cantidad) AS total_unidades,\n      SUM(dv.precio_unitario * dv.cantidad) AS ingresos,\n      SUM(p.precio_compra * dv.cantidad) AS costos,\n      SUM((dv.precio_unitario - p.precio_compra) * dv.cantidad) AS margen\n    FROM ventas v\n    JOIN detalle_ventas dv ON v.id_venta = dv.id_venta\n    JOIN productos p ON dv.id_producto = p.id_producto\n    WHERE v.fecha_venta BETWEEN ? AND ?\n    GROUP BY p.nombre_producto\n    ORDER BY margen DESC\n  ";
  connection.query(query, [desde, hasta], function (err, results) {
    if (err) return res.status(500).json({
      error: 'Error al consultar margen por producto'
    });
    res.json(results);
  });
}; //  STOCK BAJO detalle


exports.getStockCriticoDetalle = function (req, res) {
  var query = "\n    SELECT \n      p.id_producto,\n      p.codigo_producto, \n      p.nombre_producto, \n      p.stock, \n      p.stock_minimo, \n      d.nombre_distribuidor\n    FROM productos p\n    JOIN distribuidores_marcas dm ON p.id_distribuidor_marca = dm.id_distribuidor_marca\n    JOIN distribuidores d ON dm.id_distribuidor = d.id_distribuidor\n    WHERE p.stock < p.stock_minimo\n    ORDER BY d.nombre_distribuidor, p.nombre_producto ASC\n  ";
  connection.query(query, function (err, results) {
    if (err) {
      console.error("❌ Error al consultar productos críticos:", err);
      return res.status(500).json({
        error: 'Error al consultar productos críticos'
      });
    }

    res.json(results);
  });
}; //  PRODUCTOS TOP


exports.getTopProductos = function (req, res) {
  var _req$query2 = req.query,
      desde = _req$query2.desde,
      hasta = _req$query2.hasta;
  var query = "\n    SELECT p.nombre_producto, SUM(dv.cantidad) AS vendidos, SUM(dv.precio_unitario * dv.cantidad) AS ingresos\n    FROM detalle_ventas dv\n    JOIN ventas v ON v.id_venta = dv.id_venta\n    JOIN productos p ON dv.id_producto = p.id_producto\n    WHERE v.fecha_venta BETWEEN ? AND ?\n    GROUP BY p.nombre_producto\n    ORDER BY vendidos DESC\n    LIMIT 10\n  ";
  connection.query(query, [desde, hasta], function (err, results) {
    if (err) return res.status(500).json({
      error: 'Error al consultar productos top'
    });
    res.json(results);
  });
};

exports.getHistorialVentas = function (req, res) {
  var _req$query3 = req.query,
      desde = _req$query3.desde,
      hasta = _req$query3.hasta;
  var query = "\n    SELECT DATE(fecha_venta) AS fecha, SUM(total) AS total_dia\n    FROM ventas\n    WHERE fecha_venta BETWEEN ? AND ?\n    GROUP BY DATE(fecha_venta)\n    ORDER BY fecha_venta ASC\n  ";
  connection.query(query, [desde, hasta], function (err, results) {
    if (err) return res.status(500).json({
      error: 'Error al consultar historial de ventas'
    });
    res.json(results);
  });
}; // 7. CLIENTES nuevos vs recurrentes


exports.getClientesNuevosVsRecurrentes = function (req, res) {
  var _req$query4 = req.query,
      desde = _req$query4.desde,
      hasta = _req$query4.hasta;
  var query = "\n    SELECT \n      COUNT(DISTINCT CASE WHEN primera_compra BETWEEN ? AND ? THEN id_cliente END) AS nuevos,\n      COUNT(DISTINCT CASE WHEN primera_compra < ? THEN id_cliente END) AS recurrentes\n    FROM (\n      SELECT id_cliente, MIN(fecha_venta) AS primera_compra\n      FROM ventas\n      GROUP BY id_cliente\n    ) sub\n  ";
  connection.query(query, [desde, hasta, desde], function (err, results) {
    if (err) return res.status(500).json({
      error: 'Error al consultar clientes'
    });
    res.json(results[0]);
  });
}; //  VENDEDORES - rendimiento


exports.getRendimientoVendedores = function (req, res) {
  var _req$query5 = req.query,
      desde = _req$query5.desde,
      hasta = _req$query5.hasta;
  var query = "\n    SELECT u.nombre, SUM(v.total) AS total_vendido, COUNT(v.id_venta) AS ventas\n    FROM ventas v\n    JOIN usuarios u ON v.id_usuario = u.id_usuario\n    WHERE v.fecha_venta BETWEEN ? AND ?\n    GROUP BY u.id_usuario\n    ORDER BY total_vendido DESC\n  ";
  connection.query(query, [desde, hasta], function (err, results) {
    if (err) return res.status(500).json({
      error: 'Error al consultar rendimiento de vendedores'
    });
    res.json(results);
  });
}; //  VENTAS SEMANALES


exports.getVentasSemanales = function (req, res) {
  var _req$query6 = req.query,
      desde = _req$query6.desde,
      hasta = _req$query6.hasta;
  var query = "\n    SELECT WEEK(fecha_venta) AS semana, SUM(total) AS total_semanal\n    FROM ventas\n    WHERE fecha_venta BETWEEN ? AND ?\n    GROUP BY semana\n    ORDER BY semana DESC\n  ";
  connection.query(query, [desde, hasta], function (err, results) {
    if (err) return res.status(500).json({
      error: 'Error al consultar ventas semanales'
    });
    res.json(results);
  });
};

exports.getValorTotalInventario = function (req, res) {
  var query = "\n    SELECT \n      SUM(stock * precio_venta) AS valor_inventario,\n      SUM(stock * (precio_venta - precio_compra)) AS ganancia_inventario\n    FROM productos\n  ";
  connection.query(query, function (err, results) {
    if (err) {
      return res.status(500).json({
        error: 'Error al consultar valor del inventario'
      });
    }

    res.json(results[0]);
  });
}; //  PRODUCTOS CON MAYOR STOCK


exports.getProductosMayorStock = function (req, res) {
  var query = "\n    SELECT id_producto, nombre_producto, stock\n    FROM productos\n    ORDER BY stock DESC\n    LIMIT 10\n  ";
  connection.query(query, function (err, results) {
    if (err) return res.status(500).json({
      error: 'Error al consultar productos con mayor stock'
    });
    res.json(results);
  });
}; // RESUMEN DE VENTAS


exports.getResumenVentas = function (req, res) {
  var _req$query7 = req.query,
      desde = _req$query7.desde,
      hasta = _req$query7.hasta;
  var query = "\n    SELECT \n      SUM(total) AS total_ventas,\n      COUNT(id_venta) AS total_transacciones,\n      AVG(total) AS promedio_venta\n    FROM ventas\n    WHERE fecha BETWEEN ? AND ?\n  ";
  connection.query(query, [desde, hasta], function (err, results) {
    if (err) {
      return res.status(500).json({
        error: 'Error al consultar resumen de ventas'
      });
    }

    res.json(results[0]);
  });
}; //  VENTAS POR DÍA Y PRODUCTO


exports.getVentasPorDiaYProducto = function (req, res) {
  var _req$query8 = req.query,
      desde = _req$query8.desde,
      hasta = _req$query8.hasta;
  var query = "\n    SELECT \n      DATE(v.fecha) AS dia,\n      p.nombre_producto,\n      SUM(dv.cantidad) AS cantidad_vendida,\n      SUM(dv.precio_unitario * dv.cantidad) AS total_vendido\n    FROM ventas v\n    JOIN detalle_ventas dv ON v.id_venta = dv.id_venta\n    JOIN productos p ON dv.id_producto = p.id_producto\n    WHERE v.fecha BETWEEN ? AND ?\n    GROUP BY dia, p.nombre_producto\n    ORDER BY dia DESC, total_vendido DESC\n  ";
  connection.query(query, [desde, hasta], function (err, results) {
    if (err) {
      return res.status(500).json({
        error: 'Error al consultar ventas por día y producto'
      });
    }

    res.json(results);
  });
};

exports.getDetalleVentaPorDia = function (req, res) {
  var fecha = req.query.fecha;

  if (!fecha) {
    return res.status(400).json({
      error: 'Falta el parámetro "fecha"'
    });
  }

  var query = "\n    SELECT \n      DATE(v.fecha_venta) AS fecha,\n      p.codigo_producto AS codigo_producto,\n      p.nombre_producto,\n      dv.precio_unitario,\n      p.precio_compra,\n      dv.cantidad,\n      (dv.precio_unitario * dv.cantidad) AS total_linea,\n      ((dv.precio_unitario - p.precio_compra) * dv.cantidad) AS ganancia_producto,\n      (\n        SELECT SUM(total) \n        FROM ventas \n        WHERE DATE(fecha) = DATE(v.fecha_venta)\n      ) AS total_dia\n    FROM ventas v\n    JOIN detalle_ventas dv ON v.id_venta = dv.id_venta\n    JOIN productos p ON dv.id_producto = p.id_producto\n    WHERE DATE(v.fecha_venta) = ?\n    ORDER BY p.nombre_producto\n  ";
  connection.query(query, [fecha], function (err, results) {
    if (err) return res.status(500).json({
      error: 'Error al consultar ventas detalladas por día'
    });
    res.json(results);
  });
};