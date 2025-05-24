"use strict";

/* This JavaScript code snippet is setting up a connection to a MySQL database using the
`mysql2/promise` library. Here's what each part of the code does: */
var mysql = require("mysql2/promise");

var db = mysql.createPool({
  host: "localhost",
  user: "Joscian",
  password: "eq6ingsoft",
  database: ""
});
module.exports = db;