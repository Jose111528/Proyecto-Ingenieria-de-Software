const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventas.controller');

router.post('/ventas', ventasController.vender);


module.exports = router;
