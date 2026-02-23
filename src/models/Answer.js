const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
    text: {
        required: true,
        type: String
    },
    question: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
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

module.exports = mongoose.model('Answer', AnswerSchema)

