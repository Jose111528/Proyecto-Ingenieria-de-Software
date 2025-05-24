"use strict";

var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
var connection = require('./config/db'); // Conexión a la base de datos
var marcasRoutes = require('./routes/marcas.routes');
var distribuidoresRoutes = require('./routes/distribuidores.routes');
var productosRoutes = require('./routes/productos.routes'); // Importa las rutas de productos
var usersRoutes =require ('./routes/user.routes');
var distribuidorMarcasRoutes =require('./routes/distribuidoresMarcas.routes');
var informesRoutes = require('./routes/informes.routes');
var ventasRoutes = require('./routes/ventas.routes'); // Importa las rutas de ventas

dotenv.config(); // Cargar variables de entorno

const app = express();

// Configuración de CORS para permitir solicitudes desde el frontend
const corsOptions = {
  origin: 'http://localhost:3001', // Aquí debe estar la URL de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type','Authorization'],
};
app.use(cors(corsOptions));

// Middleware para procesar datos JSON
app.use(bodyParser.json());

// Ruta de prueba para verificar la conexión a la base de datos
app.get('/test-connection', function (req, res) {
  connection.query('SELECT 1 + 1 AS solution', function (err, results) {
    if (err) {
      return res.status(500).json({
        error: 'Error al conectar con la base de datos'
      });
    }
    res.json({
      message: 'Conexión exitosa',
      solution: results[0].solution
    });
  });
});

// Ruta de bienvenida
app.get('/', function (req, res) {
  res.send('Servidor funcionando 🚀');
});

// Usar las rutas de productos (en el prefijo /api)
app.use('/api', productosRoutes);
app.use('/api', marcasRoutes);
app.use('/api', distribuidoresRoutes);
app.use('/api',usersRoutes);
app.use('/api',distribuidorMarcasRoutes);
app.use('/api/informes', informesRoutes);
app.use('/api', ventasRoutes);

// Iniciar el servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
