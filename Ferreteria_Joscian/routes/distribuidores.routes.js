const express = require('express');
const router = express.Router();
const distribuidoresController = require('../controllers/distribuidores.controller');
const { route } = require('./marcas.routes');

/* This JavaScript code is setting up routes for a REST API related to distributors. Here's a breakdown
of what each route does: */
router.get('/distribuidores', distribuidoresController.getDistribuidores);
router.post('/distribuidores', distribuidoresController.createDistribuidores);
router.put('/distribuidores/:id', distribuidoresController.updateDistribuidores);
router.delete('/distribuidores/:id', distribuidoresController.deleteDistribuidores);
router.get('/distribuidores/:nombre/marcas',distribuidoresController.getMarcasPorDistribuidor);
module.exports = router;
