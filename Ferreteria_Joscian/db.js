/* This JavaScript code snippet is setting up a connection to a MySQL database using the
`mysql2/promise` library. Here's what each part of the code does: */
const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "Joscian",
  password: "eq6ingsoft",
  database: "",
});

module.exports = db;
