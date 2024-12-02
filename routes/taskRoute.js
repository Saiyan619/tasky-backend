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
               const tasks = await Task.find({ userId: req.params.userId }) 
        res.status(201).json(tasks)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});


// Get Single Task Details by MongoDbId// 

router.get('/taskInfo/:id', async (req, res) => {
    try {
       
        const singleTask = await Task.findById(req.params.id)
          // Populate the collaborators manually by matching their clerkIds
          const collaboratorDetails = await User.find({
            clerkId: { $in: singleTask.collaborators }
        }).select('name email clerkId'); // Select only the necessary fields

        // Merge the task with the populated collaborators' details
        const populatedTask = { ...singleTask.toObject(), collaborators: collaboratorDetails };


        res.status(200).json(populatedTask); // Return the found task
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

router.get('/collaborate/shared-tasks/:userId', async (req, res) => {
    try {
        console.log('Request Params:', req.params); // Debug log
        console.log('Clerk ID:', req.params.userId); // Debug log

        // Find tasks where the user is a collaborator
        const tasks = await Task.find({ collaborators: req.params.userId });

        console.log('Matched Tasks:', tasks); // Debug log

        // Populate the collaborators field manually
        const populatedTasks = await Promise.all(
            tasks.map(async (task) => {
                const collaboratorDetails = await User.find({
                    clerkId: { $in: task.collaborators } // Match the clerkIds in the task's collaborators array
                }).select('name email clerkId'); // Only select the necessary fields
                return { ...task.toObject(), collaborators: collaboratorDetails };
            })
        );

        console.log('Populated Tasks:', populatedTasks); // Debug log

        res.status(200).json(populatedTasks);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: error.message });
    }
});




module.exports = router