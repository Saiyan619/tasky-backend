const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const AiTask = require('../models/AITask');
const AITask = require('../models/AITask');

const apiKey = process.env.GEMINI_API_KEY;

// Gemini AI client
const genAI = new GoogleGenerativeAI(apiKey); 



router.post('/generate', async (req, res) => {
    console.log('Received request body:', req.body);  // Add this line
    const interests = req.body.interests;
    const userId = req.body.userId;
   

    console.log('Request received:', req.body);
    

    if (!interests || interests.length === 0) {
        return res.status(400).json({ message: "Interests are required" });
    }
    console.log('Request received:', req.body);
    
    try {
<<<<<<< HEAD
        const interestList = Array.from(interests).join(', ');
        console.log('Interest list:', interestList);  // Add this line
        
        const prompt = `Generate 5 specific and practical daily tasks for someone interested in ${interestList}. 
        Think deeply and make tasks actionable, specific, and achievable within a year of an average student that will help the person progress in life.
        Format each task in a new line.
        Make sure to give it a title,description and timetable for tasks
        Each task should directly relate to one of the selected interests.
        Tasks should be different each time and personalized to the interests.
        `;        
        
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
=======
        const prompt = "recommend tasks for me to do today my interest are food, sports, education give me todos with very short title, description and timeframe to do it"; // Dummy prompt for now
        
        
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        
        
>>>>>>> 47612f64ce9b145c8070c34c7702e3f777059141
        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        
        console.log('AI response:', response.text());  // Add this line

        const newTask = {
            userId : req.body.userId,
            interests: req.body.interests,
            task: response.text(),
            createdAt:Date.now()
        }

          // Save to the database
        const savedTask = await AITask.create(newTask);
        console.log('Task saved to the database:', savedTask);

        // Send a single response back to the client
        res.status(200).json({
            message: "Task generated and saved successfully",
            task: savedTask,
        });

        
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ message: error.message });
    }
});

<<<<<<< HEAD
// router.post('/suggestedTasks', async (req, res) => {
//     try {
        
//     } catch (error) {
//         res.status(500).json({message:error.message})
//     }
// })

module.exports = router;

=======
module.exports = router;
>>>>>>> 47612f64ce9b145c8070c34c7702e3f777059141
