const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({

    brand: {
        required: true,
        type: String
    },
    model: {
        required: true,
        type: String
    },
    year: {
        required: true,
        type: Number
    },
    price: {
        required: true,
        type: Number
    },
    description: {
        required: true,
        type: String
    },
    status: {
        required: true,
        type: String,
        enum: ['available', 'sold'],
        default: 'available'
    },
    owner: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        required: true,
        type: Date,
        default: Date.now
    },
    image: {
        required: false,
        type: String
    }
})

//Buscar un vehiculo por su ID y traer tambien el nombre del dueño (populate)
VehicleSchema.statics.findByIdWithOwner = function(id) {
    return this.findById(id).populate('owner', 'name');
};

// Buscar todos los vehículos de un usuario y traer el nombre del dueño
VehicleSchema.statics.listByOwner = function(ownerId) {
    return this.find({ owner: ownerId }).populate('owner', 'name');
};

//Buscar vehiculos aplicando filtros, paginacion y ordena por fecha.
VehicleSchema.statics.listWithFilters = function(filters, skip, limit) {
    return this.find(filters)
        .populate('owner', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ date: -1 });
};

//Cuenta total de vehiculos que cumplen con los filtros para paginacion
VehicleSchema.statics.countWithFilters = function(filters) {
    return this.countDocuments(filters);
};
;

module.exports = mongoose.model('Vehicle', VehicleSchema)


