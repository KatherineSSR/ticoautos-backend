const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const authController = require('../controllers/authController');

// POST /api/auth/register — Registrar un usuario nuevo
router.post('/register', upload.single('profileImage'), authController.register);
// Iniciar sesión
router.post('/login', authController.login);

module.exports = router;