// CSE_D_05\back-end\routes\chatBotRoutes.js
const express = require("express");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");
const fs = require("fs");

const router = express.Router();
dotenv.config();

// --- 1. Initialization and API Key Check ---
if (!process.env.GEMINI_API_KEY) {
  console.error("FATAL ERROR: GEMINI_API_KEY environment variable not set.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// --- 2. Load Constitution JSON ---
const constitutionPath = path.join(
  __dirname,
  "..",
  "..",
  "front-end",
  "src",
  "data",
  "constitution.json"
);

let constitutionData = {};
try {
  const raw = fs.readFileSync(constitutionPath, "utf-8");
  constitutionData = JSON.parse(raw);
} catch (err) {
  console.error("Error loading constitution.json:", err);
}

// --- 3. Persona and Knowledge Context ---
const systemPrompt = `
You are "NiyamAI", a highly knowledgeable AI assistant for the Digital Constitution Platform.
You provide accurate, clear, and concise answers about:
- Indian Constitution (Articles, Schedules, Amendments, significance)
- Rights and Duties of citizens
- Government structure and political processes
- Historical and recent constitutional changes
- Current civic and legal affairs
- Features of the Digital Constitution Platform (Trending, Vote, Posts, Constitution, My Activity, Profile)
`;

const platformKnowledge = `
Platform Knowledge:
- Trending: Shows popular posts and discussions.
- Vote: Users can create and participate in polls.
- Posts: Section for civic and constitutional discussions.
- Constitution: Full list of Articles (e.g., Preamble, Article 14, Article 21).
- My Activity: Displays the logged-in user’s contributions and shared posts.
- Profile: Allows users to view account details, change password, and log out.
`;

// --- 4. POST /chat Implementation ---
router.post("/", async (req, res) => {
  try {
    const userMessage = req.body.message?.trim();
    if (!userMessage) {
      return res.status(400).json({ error: "Message is required." });
    }

    // Check if user asked for a specific Article
    let context = "";
    const match = userMessage.match(/article\s*(\d+)/i);
    if (match) {
      const articleNum = match[1];
      if (constitutionData[articleNum]) {
        context = `Relevant Article Content:\n${constitutionData[articleNum]}`;
      }
    }

    // Use structured input for Gemini
    const result = await model.generateContent([
      { role: "system", parts: [{ text: systemPrompt }] },
      { role: "system", parts: [{ text: platformKnowledge }] },
      { role: "system", parts: [{ text: context }] },
      { role: "user", parts: [{ text: userMessage }] }
    ]);

    let answer = "";
    try {
      answer = result.response.text();
    } catch {
      answer = "I'm here to assist with topics related to the Indian Constitution and civic issues.";
    }

    res.json({ answer });
  } catch (error) {
    console.error("Chatbot API Error:", error?.response || error);
    res.status(500).json({
      error: "Failed to fetch response from NiyamAI.",
      details: error.message || "Unknown error"
    });
  }
});

module.exports = router;


