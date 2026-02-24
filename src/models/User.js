const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String,
        unique: true //para que el username sea único en la base de datos
    },
    password: {
        required: true,
        type: String
    },

    name: {
        required: false,
        type: String
    },

    profileImage: {
        type: String,
        default: ''
    },
    
    date : {
        type: Date,
        default: Date.now
    }
})

// consultas a la BD van aqui, no en el controlador.
UserSchema.statics.findByUsername = function (username) {
  return this.findOne({ username });
};

UserSchema.statics.createUser = function (data) {
  return this.create(data);
};

module.exports = mongoose.model('User', UserSchema);

