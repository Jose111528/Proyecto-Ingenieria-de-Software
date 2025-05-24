// routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const verifyAdmin = require('../middleware/verifyAdmin'); // Importar el middleware de verificación de administrador
const verifyToken = require('../middleware/verifyToken'); // Importar el middleware de verificación de token (si lo tienes)

// Ruta para registrar un nuevo usuario
router.post('/user/register', userController.registerUser);

// Ruta para hacer login (no necesita protección)
router.post('/user/login', userController.loginUser);

// Ruta para obtener todos los trabajadores (protegida, solo para admins)
router.get('/user/getAllWorkers', verifyToken, verifyAdmin, userController.getAllWorkers);

// Ruta para eliminar un usuario (protegida, solo el usuario correspondiente o un admin)
router.delete('/user/delete/:id', verifyToken, userController.deleteUser);

module.exports = router;
