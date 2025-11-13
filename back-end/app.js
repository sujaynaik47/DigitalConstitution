const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const changePasswordController = require("./controllers/passwordChangeThroughProfile");
const chatbotRoutes = require("./routes/chatBotRoutes"); // 👈 1. THIS LINE IS NEW
const uservotes = require("./routes/uservotes");



// --- Initialization ---
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend (Vite) URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ✅ Routes
const postRoutes = require("./routes/postRoutes");
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.post("/api/change-password", changePasswordController);
app.use("/api/chat", chatbotRoutes); // 👈 2. THIS LINE IS NEW
app.use("/api/vote", uservotes);

// ✅ MongoDB Connection
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
    console.error(`   Message: ${err.message}`);
    console.error(`   Name: ${err.name}`);
    console.error(`   Stack: ${err.stack}`);
  });

// ✅ Mongo connection events
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
