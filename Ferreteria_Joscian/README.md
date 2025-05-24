# Backend - Sistema de Inventario y Ventas

Este backend provee una API REST para gestionar productos, ventas, autenticación y usuarios. Está desarrollado con **Node.js**, **Express**, y usa **MongoDB** como base de datos.

## 📁 Estructura del Proyecto

- `/config`: Archivos de configuración como la conexión a base de datos y JWT.
- `/controllers`: Lógica de negocio para manejar las solicitudes HTTP.
- `/middleware`: Funciones intermedias como autenticación o validación.
- `/models`: Esquemas de Mongoose para MongoDB.
- `/routes`: Define los endpoints del servidor Express.
- `.env`: Variables de entorno (puerto, clave JWT, URL DB, etc).
- `index.js`: Punto de entrada del servidor.

## 🚀 Cómo correr el servidor

1. Instala las dependencias:
   ```bash
   npm install

npm start