const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    text: {
        required: true,
        type: String
    },
    vehicle: {
    
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle'
    },

    user: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
    date : {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Question', QuestionSchema)

