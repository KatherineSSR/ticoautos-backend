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

QuestionSchema.statics.findWithAnswers = async function(filter) {
    const Answer = mongoose.model('Answer');
    const questions = await this.find(filter)
        .populate('user', 'username name')
        .populate('vehicle', 'brand model year image status owner')
        .sort({ date: 1 })
        .lean();

    const questionIds = questions.map((question) => question._id);

    if (!questionIds.length) {
        return [];
    }

    const answers = await Answer.listByQuestionIdsWithUser(questionIds);
    const answersByQuestion = new Map();

    for (const answer of answers) {
        const questionKey = String(answer.question);

        if (!answersByQuestion.has(questionKey)) {
            answersByQuestion.set(questionKey, []);
        }

        answersByQuestion.get(questionKey).push(answer);
    }

    return questions.map((question) => ({
        ...question,
        answers: answersByQuestion.get(String(question._id)) || [],
    }));
};

QuestionSchema.statics.findLatestByVehicleAndUser = function(vehicleId, userId) {
    return this.findOne({ vehicle: vehicleId, user: userId })
        .sort({ date: -1 })
        .lean();
};

module.exports = mongoose.model('Question', QuestionSchema)

