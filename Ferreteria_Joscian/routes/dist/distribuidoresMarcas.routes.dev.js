"use strict";

var express = require("express");

var router = express.Router();

var _require = require("../controllers/distribuidoresMarcas.controller"),
    asociarDistribuidorMarca = _require.asociarDistribuidorMarca,
    verificarAsociacion = _require.verificarAsociacion,
    obtenerDistribuidoresMarcas = _require.obtenerDistribuidoresMarcas,
    eliminarDistribuidorMarca = _require.eliminarDistribuidorMarca; // Ruta para obtener distribuidores marcas
// 🚀 Ruta para verificar la asociación entre distribuidor y marca


router.get("/distribuidoresMarcas/verificar", verificarAsociacion); // Asegúrate de que esta ruta esté correctamente definida
// 🚀 Ruta para asociar distribuidor con marca

router.post("/distribuidoresMarcas/asociar", asociarDistribuidorMarca);
router.get("/distribuidoresMarcas/obtener", obtenerDistribuidoresMarcas);
router["delete"]("/distribuidoresMarcas/borrar", eliminarDistribuidorMarca);
module.exports = router;