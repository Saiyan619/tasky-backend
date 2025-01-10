const { default: mongoose } = require('mongoose');

const AiTaskSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    interests: { type: [String], required: true },
    task: { type: String },
    duration: { type: String, defaualt: "a day" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AiTask', AiTaskSchema);