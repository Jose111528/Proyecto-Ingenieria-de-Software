"use strict";

var express = require('express');

var router = express.Router();

var informesController = require('../controllers/informes.controller');
/* These lines of code are defining various routes in an Express router. Each `router.get` call is
setting up a route with a specific path and associating it with a corresponding controller function
from `informesController`. */


router.get('/stock-critico', informesController.getStockCriticoDetalle);
router.get('/top-productos', informesController.getTopProductos);
router.get('/resumen-ventas', informesController.getResumenVentas);
router.get('/ventas-por-dia-producto', informesController.getVentasPorDiaYProducto);
router.get('/margen-productos', informesController.getMargenPorProducto);
router.get('/historial-ventas', informesController.getHistorialVentas);
router.get('/clientes-nuevos-vs-recurrentes', informesController.getClientesNuevosVsRecurrentes);
router.get('/ventas-por-vendedor', informesController.getRendimientoVendedores);
router.get('/ventas/detalle-dia', informesController.getDetalleVentaPorDia);
router.get("/ventas-semanales", informesController.getVentasSemanales);
router.get("/valor-total-inventario", informesController.getValorTotalInventario);
router.get("/producto-mayor-stock", informesController.getProductosMayorStock);
router.get('/productos-stock', informesController.getProductosMayorStock);
module.exports = router;