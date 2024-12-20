const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Task = require('../models/Task')
const User = require('../models/User')
const GlobalActivityLogs = require('../models/GlobalActivityLogs')


// get All Activity
router.get("/global-logs", async (req, res) => {
    try {
        
        const Logs = await GlobalActivityLogs.find().populate('taskId', 'action')

        if (!Logs) { res.status(404).json({ message: "task not found" }) }
        res.status(200).json(Logs)

    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

// Adding Activity
router.post('/activity-logs/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { userId,action } = req.body
        
        const logs = await Task.findById(id);
        const activity = {
            action,
            userId
        }

        logs.activityLogs.push(activity);
        await logs.save();
        res.status(200).json(logs)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})



module.exports = router;