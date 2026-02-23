const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
        //guardar contraseña encriptada con bcrypt.hash()
        
    },

    name: {
        required: false,
        type: String
    },
    
    date : {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', UserSchema)

