const multer = require('multer');
const path = require('path');

// Configurar dónde y cómo guardar los archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Carpeta donde se guardan
  },
  filename: (req, file, cb) => {
    // Nombre único: timestamp + extensión original
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

module.exports = upload;