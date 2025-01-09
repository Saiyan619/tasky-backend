const { default: mongoose } = require('mongoose');

const AiTaskSchema = new mongoose.Schema({
    userId: { type: String,  },
    interests: { type: [String],  },
    task: { type: String, },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AiTask', AiTaskSchema);