const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { username, password, name, profileImage } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username y password son requeridos' });
    }

    // Verificar que el username no exista, la funcion findByUsername esta en user.js
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'El username ya está en uso' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario (usa la funciondel modelo en user.js)
    await User.createUser({
      username,
      password: hashedPassword,
      name: name || '',
      profileImage: profileImage || ''
    });

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

// POST /api/auth/login va aqui abajo - parte de karol

module.exports = { register, /* login */ };