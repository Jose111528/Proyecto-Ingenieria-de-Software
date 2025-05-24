const express = require('express');
const router = express.Router();
const marcasController = require('../controllers/marcas.controller');


router.get('/marcas', marcasController.getMarcas);
router.get('/marcas/:id', marcasController.getMarcaById);
router.post('/marcas', marcasController.createMarca);
router.put('/marcas/:id', marcasController.updateMarca);
router.delete('/marcas/:id', marcasController.deleteMarca);


module.exports = router;
