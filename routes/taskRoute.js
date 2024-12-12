const express = require('express')
const mongoose = require('mongoose'); 
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
        console.log('Task before saving:', taskRef);

    
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


// Filter Tasks
// Filter tasks based on criteria
router.get('/filterTasks', async (req, res) => {
    try {
        const { userId, status, priority, search } = req.query;

        const query = { userId }; // Always filter by the user's ID (Clerk ID)

        // Add filters if specified
        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } }, // Case-insensitive search in title
                { description: { $regex: search, $options: 'i' } } // Case-insensitive search in description
            ];
        }

        // Fetch the filtered tasks
        const tasks = await Task.find(query);

        if (!tasks.length) {
            return res.status(404).json({ message: "No tasks found matching the criteria" });
        }

        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error filtering tasks:", error.message);
        res.status(500).json({ message: "Failed to filter tasks" });
    }
});


// Get Single Task Details by MongoDbId// 
router.get('/taskInfo/:id', async (req, res) => {
    try {
        const singleTask = await Task.findById(req.params.id);
        console.log('Task collaborators:', singleTask.collaborators); // Check collaborators field

        // Extract only the clerkIds from collaborators
        const collaboratorIds = singleTask.collaborators.map((collab) => collab.clerkId);

        // Fetch the users corresponding to those clerkIds
        const collaboratorDetails = await User.find({
            clerkId: { $in: collaboratorIds }
        }).select('name email clerkId'); // Select only the necessary fields

        // Merge the task with the populated collaborators' details
        const populatedTask = { ...singleTask.toObject(), collaborators: collaboratorDetails };

        res.status(200).json(populatedTask); // Return the found task
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle errors
    }
});

router.put('/editTask/:id', async (req, res) => {
    try {
        const { userId, title, description, status, priority, dueDate, collaborators } = req.body;
        const taskId = req.params.id;

        console.log("Incoming Request Params:", req.params);
        console.log("Incoming Request Body:", req.body);

        // Fetch the task
        const task = await Task.findById(taskId);

        if (!task) {
            console.log("Task not found");
            return res.status(404).json({ message: "Task not found" });
        }

        // Check if the user is the creator
        if (task.userId === userId) {
            console.log("User is the creator of the task:", userId);

            // Merge or replace collaborators
            const updatedCollaborators = collaborators
                ? [...new Map([...task.collaborators, ...collaborators].map(c => [c.clerkId, c])).values()] // Merge by `clerkId`
                : task.collaborators;

            console.log("Updated Collaborators:", updatedCollaborators);

            // Prepare the updated data
            const updatedData = {
                title: title || task.title,
                description: description || task.description,
                status: status || task.status,
                priority: priority || task.priority,
                dueDate: dueDate || task.dueDate,
                collaborators: updatedCollaborators,
            };

            const updatedTask = await Task.findByIdAndUpdate(taskId, { $set: updatedData }, { new: true });
            console.log("Task successfully updated:", updatedTask);
            return res.status(200).json(updatedTask);
        }

        // Check if the user is in the collaborators array
        const collaborator = task.collaborators.find(c => c.clerkId === userId);

        if (!collaborator) {
            console.log("User not a collaborator:", userId);
            return res.status(403).json({ message: "You are not a collaborator on this task" });
        }

        // Check if the role allows updates
        if (collaborator.role !== 'owner' && collaborator.role !== 'collaborator') {
            console.log("User lacks permissions:", userId, collaborator.role);
            return res.status(403).json({ message: "You do not have permission to update this task" });
        }

        // Merge or replace collaborators
        const updatedCollaborators = collaborators
            ? [...new Map([...task.collaborators, ...collaborators].map(c => [c.clerkId, c])).values()] // Merge by `clerkId`
            : task.collaborators;

        console.log("Updated Collaborators:", updatedCollaborators);

        // Prepare the updated data
        const updatedData = {
            title: title || task.title,
            description: description || task.description,
            status: status || task.status,
            priority: priority || task.priority,
            dueDate: dueDate || task.dueDate,
            collaborators: updatedCollaborators,
        };

        const updatedTask = await Task.findByIdAndUpdate(taskId, { $set: updatedData }, { new: true });
        console.log("Task successfully updated:", updatedTask);
        return res.status(200).json(updatedTask);
    } catch (error) {
        console.error("Error during task update:", error.message);
        return res.status(500).json({ message: error.message });
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
        const userId = req.params.userId;

        console.log('Request Params:', req.params); // Debug log
        console.log('Clerk ID:', userId); // Debug log

        // Find tasks where the user is a collaborator
        const tasks = await Task.find({
            'collaborators.clerkId': userId // Match the clerkId inside the collaborators array
        });

        console.log('Matched Tasks:', tasks); // Debug log

        // Populate the collaborators field manually
        const populatedTasks = await Promise.all(
            tasks.map(async (task) => {
                const collaboratorDetails = await User.find({
                    clerkId: { $in: task.collaborators.map((collab) => collab.clerkId) } // Match the clerkIds in the task's collaborators array
                }).select('name email clerkId');
                
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