"use strict";

var jwt = require('jsonwebtoken');
/* The `exports.generateToken` function is responsible for generating a JSON Web Token (JWT) in
Node.js.  */


exports.generateToken = function (userId, role) {
  var payload = {
    userId: userId,
    role: role
  };
  var secret = 'mi_clave_secreta';
  var options = {
    expiresIn: '1h'
  };
  return jwt.sign(payload, secret, options);
};
/* The `exports.verifyToken` function is responsible for verifying a JSON Web Token (JWT) using the
`jsonwebtoken` library in Node.js. */


exports.verifyToken = function (token) {
  var secret = 'mi_clave_secreta';

  try {
    var decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    return null;
  }
};