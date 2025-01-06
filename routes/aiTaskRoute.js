const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(apiKey);  // Remove the object wrapper

router.get('/generate', async (req, res) => {
    try {
        const prompt = "recommend tasks for me to do today my interest are food, sports, education give me todos with very short title, description and timeframe to do it"; // Get the prompt from the query parameters
        
        // Get the model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        
        // Generate content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        res.json({ response: response.text() }); 
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;