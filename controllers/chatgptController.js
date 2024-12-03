const axios = require("axios");

module.exports = {
    async chatgpt(req, res) {
        const { message } = req.body;  // Get the message from the request body
        console.log("Messagefsdfsd:", message);
        const API_KEY = process.env.OPENAI_API_KEY; // API key from environment variable
        const API_URL = "https://api.openai.com/v1/chat/completions"; // Correct endpoint

        // Data for the request
        const data = {
            model: "gpt-3.5-turbo", // Correct model
            messages: [
                { role: "user", content: message } // Set the user's message
            ],
            max_tokens: 1000,
            temperature: 0.7,
            top_p: 1,
            n: 1,
            stop: ["###"]
        };

        // Headers with API key
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        };

        try {
            // Make POST request to OpenAI API
            const response = await axios.post(API_URL, data, { headers });
            res.status(200).json(response.data); // Return the response data
        } catch (error) {
            console.error("Error generating chat response:", error);
            res.status(500).json({ message: error.message }); // Return error if any
        }
    }
};
