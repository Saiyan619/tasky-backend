const express = require('express')
const router = express.Router()
const Task = require('../models/Task')


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
            updatedAt: req.body.updatedAt
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
        const tasks = await Task.find({ userId: req.params.userId })
        res.status(201).json(tasks)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
    
});

// Get Single Task by MongoDbId

router.get('/taskInfo/:id', async (req, res) => {
    try {
        const singleTask = await Task.findById(req.params.id); // Corrected syntax
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
        
        const { title, description, status, priority } = req.body;
        const UpdatingTask = await Task.findByIdAndUpdate(
            req.params.id, // the id to be updated "/:id"
            { title, description, status, priority }, // the data to update from the chosen id
            { new: true }  // returns the updated task after the update
        )
        console.log("Updated Task:", UpdatingTask);

       res.status(200).json(UpdatingTask)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})


module.exports = router