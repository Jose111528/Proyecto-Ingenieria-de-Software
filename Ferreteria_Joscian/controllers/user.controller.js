/* This JavaScript code represents a user controller file for a Node.js application. Here's a breakdown
of what each function does: */

const bcrypt = require('bcryptjs');  // Usando bcryptjs para encriptar contraseñas
const jwt = require('jsonwebtoken');  // Usando jsonwebtoken para generar JWT

const User = require('../models/user.model');

// Registrar un nuevo usuario
exports.registerUser = async (req, res) => {
  const { username, password, role, telefono } = req.body;

  try {

    if (!['admin', 'trabajador'].includes(role)) {
      return res.status(400).json({ message: 'El rol debe ser "admin" o "trabajador"' });
    }


    const existingUser = await User.getByUsername(username);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const newUser = { username, password: hashedPassword, role, telefono };
    const result = await User.create(newUser);

    res.status(201).json({ message: 'Usuario registrado correctamente', userId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
  }
};

// Iniciar sesión de usuario
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const users = await User.getByUsername(username);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.contraseña);

    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Crear un payload para el JWT
    const payload = {
      userId: user.id_usuario,
      role: user.role,
    };


    const token = jwt.sign(payload, 'tu_secreto_aqui', { expiresIn: '24h' });


    res.status(200).json({
      message: 'Login exitoso',
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al autenticar el usuario', error: error.message });
  }
};

// Eliminar un usuario
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await User.deleteById(id);
    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
  }
};

// Obtener todos los trabajadores (solo para administradores)
exports.getAllWorkers = async (req, res) => {
  try {
    const workers = await User.getAllWorkers();
    res.status(200).json(workers);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener trabajadores', error: error.message });
  }
};
