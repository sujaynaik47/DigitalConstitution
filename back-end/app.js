const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// --- Import Routes ---
// Assuming your chatbot route file is in './routes/chatBotRoutes.js'
const chatbotRoutes = require("./routes/chatBotRoutes"); 
// Assuming other routes are in your project structure
const userRoutes = require("./routes/userRoutes"); 
const postRoutes = require("./routes/postRoutes"); 
const uservotes = require("./routes/uservotes");
const changePasswordController = require("./controllers/passwordChangeThroughProfile");


// --- Initialization ---
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
// CRITICAL: Express JSON Body Parser to read req.body.message
app.use(express.json()); 

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend (Vite) URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// --- Routes ---
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.post("/api/change-password", changePasswordController);
app.use("/api/vote", uservotes);

// CRITICAL: Chatbot API endpoint - ensures frontend calls the correct path
app.use("/api/chat", chatbotRoutes); 

// --- MongoDB Connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    console.log(`📡 Connected to cluster: ${mongoose.connection.host}`);
    console.log(`📂 Database name: ${mongoose.connection.name}`);

    // Start the server only after successful DB connection
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:");
    console.error(`    Message: ${err.message}`);
    process.exit(1); // Exit on fatal DB connection failure
  });

// --- Optional: Mongoose connection events (as you had them) ---
mongoose.connection.on("connected", () => {
  console.log("🔗 Mongoose event: connected");
});

mongoose.connection.on("error", (err) => {
  console.error("⚠️ Mongoose event: error", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("🔌 Mongoose event: disconnected");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🛑 Mongoose connection closed due to app termination");
  process.exit(0);
});
