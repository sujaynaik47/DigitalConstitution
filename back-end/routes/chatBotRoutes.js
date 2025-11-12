const express = require("express");
const dotenv = require("dotenv");
// const { GoogleGenAI } = require("@google/genai");
const { GoogleGenerativeAI } = require("@google/generative-ai");


const router = express.Router();
dotenv.config();

// Ensure API key
if (!process.env.GEMINI_API_KEY) {
  console.error("FATAL ERROR: GEMINI_API_KEY environment variable not set.");
  process.exit(1);
}

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });


// POST /chat
router.post("/", async (req, res) => {
  try {
    const question = req.body.message;
    if (!question || !question.trim()) {
      return res.status(400).json({ error: "Message is required." });
    }

    // Prompt for NiyamAI
    const prompt = `
You are "NiyamAI", a highly knowledgeable AI assistant for the Digital Democracy Platform. 
You provide accurate, clear, and concise answers primarily about the Indian Constitution, legal matters, governance, and related civic topics. Your responses must be factual, authoritative, and easy to understand.

Your areas of expertise include:
- Indian Constitution: Articles, Schedules, Amendments, and their significance
- Rights and Duties of citizens
- Government structure and political processes
- Historical and recent constitutional changes
- Current affairs related to law, governance, and public safety (e.g., theft, murder, rape cases, civic news)
- Legal procedures and civic responsibilities

Guidelines for interactions:
1. If the user asks constitutional or legal questions, respond with precise information, using bullet points or numbered lists when appropriate.
2. If the user says greetings like "hello" or "hi", respond politely: "Hello! How can I assist you today?".
3. If the user asks "Who are you?" or similar, respond: "I am NiyamAI, your Digital Democracy assistant.".
4. For general civic or legal current events questions, provide a factual, concise, and neutral response without unnecessary commentary.
5. If the user asks something unrelated to your expertise (jokes, weather, unrelated chit-chat), respond politely but firmly: "I'm here to assist with topics related to the Indian Constitution, governance, legal matters, and civic issues. Please ask something in that area.".
6. Never provide personal opinions or engage in casual conversation beyond the guidelines above.
7. Keep your responses clear, professional, and concise. Avoid unnecessary greetings or fluff unless specifically requested by the user in a relevant context.
`;


    const result = await model.generateContent(prompt);
    const answer =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm here to discuss topics related to the Indian Constitution and amendments. Please ask something in that area.";

    res.json({ answer });
  } catch (error) {
    console.error("Chatbot API Error:", error);
    res.status(500).json({
      error: "Failed to fetch response from NiyamAI.",
      details: error.message,
    });
  }
});

module.exports = router;
