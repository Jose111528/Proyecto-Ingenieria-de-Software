"use strict";

var express = require('express');

var router = express.Router();

var distribuidoresController = require('../controllers/distribuidores.controller');

var _require = require('./marcas.routes'),
    route = _require.route;
/* This JavaScript code is setting up routes for a REST API related to distributors. Here's a breakdown
of what each route does: */


router.get('/distribuidores', distribuidoresController.getDistribuidores);
router.post('/distribuidores', distribuidoresController.createDistribuidores);
router.put('/distribuidores/:id', distribuidoresController.updateDistribuidores);
router["delete"]('/distribuidores/:id', distribuidoresController.deleteDistribuidores);
router.get('/distribuidores/:nombre/marcas', distribuidoresController.getMarcasPorDistribuidor);
module.exports = router;