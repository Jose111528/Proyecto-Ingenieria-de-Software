const express = require("express");
const router = express.Router();
const {  asociarDistribuidorMarca, verificarAsociacion, obtenerDistribuidoresMarcas,eliminarDistribuidorMarca } = require("../controllers/distribuidoresMarcas.controller");

// Ruta para obtener distribuidores marcas


// 🚀 Ruta para verificar la asociación entre distribuidor y marca
router.get("/distribuidoresMarcas/verificar", verificarAsociacion);  // Asegúrate de que esta ruta esté correctamente definida

// 🚀 Ruta para asociar distribuidor con marca
router.post("/distribuidoresMarcas/asociar", asociarDistribuidorMarca);
router.get("/distribuidoresMarcas/obtener",obtenerDistribuidoresMarcas);
router.delete("/distribuidoresMarcas/borrar",eliminarDistribuidorMarca);

module.exports = router;
