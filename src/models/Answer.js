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

AnswerSchema.statics.listByQuestionIdsWithUser = function(questionIds) {
    return this.find({ question: { $in: questionIds } })
        .populate('user', 'username name')
        .sort({ date: 1 })
        .lean();
};

AnswerSchema.statics.hasForQuestion = function(questionId) {
    return this.exists({ question: questionId });
};

module.exports = mongoose.model('Answer', AnswerSchema)

