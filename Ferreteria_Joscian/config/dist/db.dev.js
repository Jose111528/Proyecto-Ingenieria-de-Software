"use strict";

/*This code snippet is setting up a connection to a MySQL database using the `mysql2` package in
Node.js.
*/

/* This code snippet is setting up a connection to a MySQL database using the `mysql2` package in
Node.js.  */
var mysql = require('mysql2');

var dotenv = require('dotenv');

dotenv.config();
var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});
/* The `connection.connect()` function in the provided code snippet is establishing a connection to the
MySQL database using the configuration details provided (host, user, password, database). */

connection.connect(function (err) {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
    return;
  }

  console.log('Conectado a la base de datos MySQL');
  connection.query('SELECT 1 + 1 AS solution', function (err, results) {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      return;
    }

    console.log('Consulta de prueba ejecutada:', results[0].solution);
  });
});
module.exports = connection;