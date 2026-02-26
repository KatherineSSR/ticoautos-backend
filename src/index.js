require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

// Conectar a MongoDB
connectDB();

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors({
  origin: '*', //cambiar mas adelente por la url de nuestro frontend
  methods: '*'
}));

//Para que el frontend pueda acceder a las imágenes subidas, se sirve la carpeta "uploads" como estática
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); //express.static:le dice a express que si alguien pide una URL que empiece con uploads, buscque el archivo en la carpeta uploads

// Rutas 
app.use('/api/auth', require('./routes/authRoutes')); //registro y login

// Levantar servidor
app.listen(process.env.PORT, () => console.log(`Escuchando el puerto ${process.env.PORT}`))