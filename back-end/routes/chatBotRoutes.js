const express = require("express");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();
const router = express.Router();

// Ensure API key
if (!process.env.GEMINI_API_KEY) {
  console.error("FATAL ERROR: GEMINI_API_KEY environment variable not set.");
  process.exit(1);
}

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// POST /api/chat
router.post("/", async (req, res) => {
  console.log("📩 Received:", req.body);

  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required." });
    }

    // Complete prompt (system + user input)
    const prompt = `
You are "NiyamAI", a highly knowledgeable AI assistant for the Digital Democracy Platform.
You provide accurate, clear, and concise answers about the Indian Constitution, law, and governance.

Rules:
1. If the user greets you, reply politely.
2. If the user asks "Who are you?", reply "I am NiyamAI, your Digital Democracy assistant."
3. For questions about the Constitution, articles, amendments, or governance — give short, clear, factual answers.
4. If question is unrelated (e.g., jokes, weather), say: "I'm here to help with constitutional, legal, or civic matters."

User: ${message}
NiyamAI:
`;

    // Generate Gemini response
    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.status(200).json({ answer: reply });
  } catch (error) {
    console.error("Chatbot API Error:", error);
    res.status(500).json({
      error: "Failed to fetch response from NiyamAI.",
      details: error.message,
    });
  }
});

module.exports = router;


