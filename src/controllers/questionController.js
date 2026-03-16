const Question = require('../models/Question');
const Answer = require('../models/Answer');
const Vehicle = require('../models/Vehicle');

// Obtener las preguntas de un vehículo
// GET /api/questions/vehicle/:vehicleId
exports.getVehicleQuestions = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const vehicle = await Vehicle.findById(vehicleId).lean();
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    const isOwner = String(vehicle.owner) === String(userId);

    const filter = isOwner
      ? { vehicle: vehicleId }
      : { vehicle: vehicleId, user: userId };

    const result = await Question.findWithAnswers(filter);

    // El frontend usa isOwner para decidir (vendedor o comprador)
    return res.json({ isOwner, questions: result });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching questions", error });
  }
};

// Obtener todas las preguntas de los vehículos del dueño autenticado
// GET /api/questions/inbox
exports.getOwnerInbox = async (req, res) => {
  try {
    const userId = req.user?._id;

    //
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const ownedVehicles = await Vehicle.find({ owner: userId }).select('_id').lean();
    const vehicleIds = ownedVehicles.map((vehicle) => vehicle._id);

    if (!vehicleIds.length) {
      return res.json({ questions: [] });
    }
  
    const questions = await Question.findWithAnswers({ vehicle: { $in: vehicleIds } });
    return res.json({ questions });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching inbox', error });
  }
};

// Obtener todas las preguntas creadas por el usuario autenticado
// GET /api/questions/my-questions
exports.getMyQuestions = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
  
    const questions = await Question.findWithAnswers({ user: userId });
    return res.json({ questions });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching your questions', error });
  }
};
// Crear una nueva pregunta
// POST /api/questions/vehicle/:vehicleId (auth)
exports.createQuestion = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { content } = req.body; 
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const trimmed = (content || "").trim();
    if (!trimmed) {
      return res.status(400).json({ message: "The question cannot be empty." });
    }

    const vehicle = await Vehicle.findById(vehicleId).lean();
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    if (String(vehicle.owner) === String(userId)) {
      return res.status(403).json({ message: "You cannot ask questions about your own vehicle." });
    }

    const lastQuestion = await Question.findLatestByVehicleAndUser(vehicleId, userId);

    if (lastQuestion) {
      const hasAnswer = await Answer.hasForQuestion(lastQuestion._id);
      if (!hasAnswer) {
        return res.status(409).json({
          message:
            "You already have a pending question. Wait for the seller's reply before asking again.",
          pendingQuestionId: lastQuestion._id,
        });
      }
    }

    const question = new Question({
      text: trimmed,
      user: userId,
      vehicle: vehicleId,
    });

    await question.save();

    const populated = await Question.findById(question._id)
      .populate("user", "username name")
      .lean();

    return res.status(201).json({ ...populated, answers: [] });
  } catch (error) {
    return res.status(500).json({ message: "Error creating question", error });
  }
};

// Responder una pregunta
// POST /api/questions/:questionId/answer (auth)
exports.createAnswer = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { content } = req.body;
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ message: 'Not authenticated' });

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    const vehicle = await Vehicle.findById(question.vehicle);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    if (String(vehicle.owner) !== String(userId)) {
      return res.status(403).json({ message: 'Only the vehicle owner can answer.' });
    }

    // Evitar múltiples respuestas  1 a 1
    const existing = await Answer.hasForQuestion(questionId);
    if (existing) {
      return res.status(409).json({ message: 'This question has already been answered.' });
    }

    const answer = new Answer({
      text: content, 
      user: userId,
      question: questionId,
    });

    await answer.save();

    const populated = await Answer.findById(answer._id).populate('user', 'username name').lean();
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Error creating answer', error });
  }
};