"use strict";

var express = require('express');

var router = express.Router();

var ventasController = require('../controllers/ventas.controller');

router.post('/ventas', ventasController.vender);
module.exports = router;