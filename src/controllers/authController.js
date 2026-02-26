const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { username, password, name } = req.body;
    const profileImage = req.file ? req.file.filename : ''; // Si se subió una imagen, guarda su nombre, sino deja vacío

    if (!username || !password) {
      return res.status(400).end();
    }

    // Verificar que el username no exista, la funcion findByUsername esta en user.js
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).end();
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

    res.status(201).end();
  } catch (error) {
    res.status(500).end();
  }
};

//LOGIN
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {// Validar que se proporcionen username y password
      return res.status(400).end();
    }

    // Buscar al usuario por username
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).end();
    }

    // Comparar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).end();
    }

    // Generar un token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({ token }); // Devolver el token al cliente
  } catch (error) { 
    res.status(500).end();
  }
};

module.exports = { register, login };