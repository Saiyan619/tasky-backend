const express = require('express')
const mongoose = require('mongoose'); // Import mongoose here
const router = express.Router()
const Task = require('../models/Task')
const User = require('../models/User')

//Create Task

router.post('/', async (req, res) => {
    try {
        const data = {
            userId: req.body.userId,
            title: req.body.title,
            description: req.body.description,
            status: req.body.status || 'pending',
            dueDate: req.body.dueDate,
            priority: req.body.priority || 'medium',
            createdAt: req.body.createdAt,
            updatedAt: req.body.updatedAt,
            collaborators: req.body.collaborators
        };

        const taskRef = await Task.create(data);
    
        const taskRes = taskRef.save();
        
        res.status(201).json(taskRes);
        
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
})


// Get All Task

router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(201).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
    
});

// Get Task By ClerkId

router.get('/user/:userId', async (req, res) => {
    try {
               // Find tasks where userId matches
               const tasks = await Task.find({ userId: req.params.userId }).populate('collaborators', 'name email'); // Populate collaborators with name and email fields   
        res.status(201).json(tasks)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});


// Get Single Task by MongoDbId// 

router.get('/taskInfo/:id', async (req, res) => {
    try {
        const singleTask = await Task.findById(req.params.id).populate('collaborators', 'name email')


        res.status(200).json(singleTask); // Return the found task
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle errors
    }
});


// Update Task details

router.put('/editTask/:id', async (req, res) => {
    try {
        // Log incoming request parameters and body
        console.log("Request Params:", req.params);
        console.log("Request Body:", req.body);
        
        const { title, description, status, priority, dueDate, collaborators } = req.body;
        const UpdatingTask = await Task.findByIdAndUpdate(
            req.params.id, // the id to be updated "/:id"
            { title, description, status, priority, dueDate, collaborators }, // the data to update from the chosen id
            { new: true }  // returns the updated task after the update
        )
        console.log("Updated Task:", UpdatingTask);

        res.status(200).json(UpdatingTask)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

// Delete Task///
router.delete('/deleteTask/:id', async (req, res) => {
    try {
        const taskRef = req.params.id
        const taskRes = await Task.findByIdAndDelete(taskRef);
        res.status(200).json(taskRes)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Get Shared Task
// router.get('/collaborate/shared-tasks/:userId', async (req, res) => {
//     try {
//                 // Query tasks where the collaborators array includes the provided user ID
//         const tasks = await Task.find({ collaborators: mongoose.Types.ObjectId(userId) })
//         .populate({
//             path: 'collaborators', // Populate collaborators with User data
//             select: 'name email'   // Retrieve specific fields from User schema
//         });
//         res.status(200).json(tasks);

//     } catch (error) {
//         res.status(500).json({ mesaage: error.message });
//     }
// })

router.get('/collaborate/shared-tasks/:userId', async (req, res) => {
    try {
        // Use `new mongoose.Types.ObjectId()` to convert the userId to ObjectId
        const tasks = await Task.find({ collaborators: new mongoose.Types.ObjectId(req.params.userId) })
            .populate('collaborators', 'name email'); // Populate collaborators with name and email

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = router