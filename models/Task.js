const { default: mongoose } = require("mongoose");


const TaskSchema = new mongoose.Schema({
    userId: { type: String, require: true },
    title: { type: String, require: true },
    description: { type: String, require: true },
    status: { type: String, default: 'pending', enum: ['pending', 'ongoing', 'completed', 'failed'] },
    dueDate: { type: Date, default: Date.now },
    priority: { 
        type: String, 
        enum: ["low", "medium", "high"], 
        default: "medium" 
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    collaborators: [{
        clerkId: { type: String}, // Clerk ID for the collaborator
        role: {
            type: String,
            enum: ["owner", "collaborator", "viewer"],
            default: "viewer",
        }
    }]  
})

module.exports = mongoose.model('task', TaskSchema);