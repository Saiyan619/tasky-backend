const express = require('express');
const router = express.Router();
const User = require('../models/User');


// Create A New User

router.post('/', async (req, res) => {
    try {
             // Set up data with Clerk ID as the unique identifier
        const data = {
            clerkId: req.body.clerkId, // Clerk's unique ID for the user
            name: req.body.name,
            email: req.body.email,
            role: req.body.role || 'user', // Optional role; defaults to 'user' if not provided
            image: req.body.image
        }
        const userRef = await User.findOneAndUpdate(
            { clerkId: data.clerkId },
            data,
            { new: true, upsert: true, runValidators: true });
    
        const userRes = userRef.save()
        
        res.status(201).json(userRes);

    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
})


// Get All Users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//Get Users by ClerkId
router.get('/:clerkId', async (req, res) => {
    const clerkIdDataRef = req.params.clerkId;
    try {
        const clerkIdDataRes = await User.findOne({ clerkId: clerkIdDataRef })
        if (!clerkIdDataRes) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(clerkIdDataRes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

module.exports = router