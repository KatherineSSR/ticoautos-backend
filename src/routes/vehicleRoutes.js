const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

//Para paginas publicas:
// Listar vehiculos con filtros y paginacion 
router.get('/', vehicleController.listVehicles);

//Protegidas con el middleware de autenticacion:
router.get('/my', authMiddleware, vehicleController.getMyVehicles); // Debe ir ANTES de /:id
router.post('/', authMiddleware, upload.single('image'), vehicleController.createVehicle);
router.put('/:id', authMiddleware, upload.single('image'), vehicleController.updateVehicle);
router.delete('/:id', authMiddleware, vehicleController.deleteVehicle);
router.patch('/:id/sold', authMiddleware, vehicleController.markAsSold); // Marcar como vendidos

// Ver detalle de un vehiculo (debe ir despues de rutas especificas como /my)
router.get('/:id', vehicleController.getVehicleDetail);

module.exports = router;
