const Vehicle = require('../models/Vehicle');

// Crear un vehículo
const createVehicle = async (req, res) => {
	try {
		   const { brand, model, year, price, description, status } = req.body;
		   if (!brand || !model || !year || !price || !description) {
			   return res.status(400).end();
		   }
		   const image = req.file ? req.file.filename : ""; // Procesar imagen como string
		   const vehicle = new Vehicle({ brand, model, year, price, description, status: status || 'available',
			   owner: req.user._id, // del token JWT
			   date: new Date(), image
		   });
		   await vehicle.save();
		   res.status(201).json(vehicle);
	} catch (error) {
		res.status(500).end();
	}
};

// Ver detalle de un solo vehículo
const getVehicleDetail = async (req, res) => {
	try {
		const vehicle = await Vehicle.findByIdWithOwner(req.params.id);
		if (!vehicle) {
			return res.status(404).end();
		}
		res.json(vehicle);
	} catch (error) {
		res.status(500).end();
	}
};


// Editar un vehículo (put)
const updateVehicle = async (req, res) => {
	try {
		const vehicle = await Vehicle.findByIdWithOwner(req.params.id);
		if (!vehicle) {
			return res.status(404).end();
		}
		if (vehicle.owner._id.toString() !== req.user.id) { // Solo el duenio puede editar
			return res.status(403).end();
		}
		const { brand, model, year, price, description, status } = req.body;
		vehicle.brand = brand || vehicle.brand;
		vehicle.model = model || vehicle.model;
		vehicle.year = year || vehicle.year;
		vehicle.price = price || vehicle.price;
		vehicle.description = description !== undefined ? description : vehicle.description;
		vehicle.status = "available";
		if (req.file) vehicle.image = req.file.filename; // Actualizar imagen si se sube una nueva
		await vehicle.save();
		res.json(vehicle);
	} catch (error) {
    console.error('Error al editar vehículo:', error);
    res.status(500).end();
    }
};

const deleteVehicle = async (req, res) => {
	try {
		const vehicle = await Vehicle.findByIdWithOwner(req.params.id);
		if (!vehicle) {
			return res.status(404).end();
		}
		if (vehicle.owner._id.toString() !== req.user.id) { // Solo el duenio puede eliminar
			return res.status(403).end();
		}
		await vehicle.deleteOne();
		res.status(204).end();
	} catch (error) {
		res.status(500).end();
	}
};

// Marcar como vendido (patch)
const markAsSold = async (req, res) => {
	try {
		const vehicle = await Vehicle.findByIdWithOwner(req.params.id);
		if (!vehicle) {
			return res.status(404).end();
		}
		if (vehicle.owner._id.toString() !== req.user._id.toString()) { // Solo el dueño puede marcar como vendido
			return res.status(403).end();
		}
		vehicle.status = 'sold';
		await vehicle.save();
		res.status(204).end();
	} catch (error) {
		res.status(500).end();
	}
};

// Listar vehiculos con filtros y paginacion
const listVehicles = async (req, res) => {
	try {
		const { brand, model, minYear, maxYear, minPrice, maxPrice, status, page = 1, limit = 6} = req.query;

        //Filtros
		const filter = {};
		if (brand) filter.brand = brand;
		if (model) filter.model = model;
		if (status) filter.status = status;
		if (minYear || maxYear) {
			filter.year = {};
			if (minYear) filter.year.$gte = Number(minYear); //$gte (mayor o igual)
			if (maxYear) filter.year.$lte = Number(maxYear); //$lte (menor o igual)
		}
		if (minPrice || maxPrice) {
			filter.price = {};
			if (minPrice) filter.price.$gte = Number(minPrice);
			if (maxPrice) filter.price.$lte = Number(maxPrice);
		}

		// Paginacion, calcula cuantos registros saltar para mostrar la pagina actual
		const skip = (Number(page) - 1) * Number(limit); 

		//Cuenta cuantos cumplen los filtros para saber el total de resultados y paginas
		   const total = await Vehicle.countWithFilters(filter);

		   // Obtiene los vehiculos con filtros, paginacion y ordenados por fecha
		   const vehicles = await Vehicle.listWithFilters(filter, skip, Number(limit));

          //Nos devuelve un objeto con lo que dice ahi 
		   res.json({
			   vehicles,
			   total,
			   page: Number(page),
			   pages: Math.ceil(total / Number(limit))
		   });
	} catch (error) {
		res.status(500).end();
	}
};


const getMyVehicles = async (req, res) => {
	try {
		const vehicles = await Vehicle.find({ owner: req.user._id }).populate('owner', 'name');
		res.json(vehicles);
	} catch (error) {
		res.status(500).end();
	}
};

module.exports = {
	listVehicles,
	getVehicleDetail,
	createVehicle,
	updateVehicle,
	deleteVehicle,
	markAsSold,
	getMyVehicles
};
