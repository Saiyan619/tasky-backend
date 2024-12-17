const mongoose = require('mongoose');

const GlobalActivityLogSchema = new mongoose.Schema({
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'task', required: true },
    action: { type: String, required: true },
    userId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('GlobalActivityLogs', GlobalActivityLogSchema);