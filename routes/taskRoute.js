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

module.exports = router