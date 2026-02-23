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
        required: false,
        type: String
    },
    status: {
        required: true,
        type: String,
        enum: ['disponible', 'vendido'],
        default: 'disponible'
    },

    owner: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date : {
        type: Date,
        default: Date.now
    },
    images: {
        required: false,
        type: [String]
    }
})

module.exports = mongoose.model('Vehicle', VehicleSchema)


