const { default: mongoose } = require("mongoose");


const UserSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true }, // Clerk's user ID
    name: { type: String, required: true },                  // User's display name
    email: { type: String, required: true, unique: true },   // User's email
    role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Role for permissions
    createdAt: { type: Date, default: Date.now },            // User's registration date
})

module.exports = mongoose.model('user', UserSchema);