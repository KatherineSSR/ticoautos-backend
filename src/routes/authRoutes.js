const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/register — Registrar un usuario nuevo
router.post('/register', authController.register);

//aqui va api de login, tambien requiere a authController- parte de karol

module.exports = router;