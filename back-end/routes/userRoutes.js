// const express = require("express");
// const User = require("../models/userModel");

// const router = express.Router();

// // ✅ Get all users
// router.get("/", async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // ✅ Add new user
// router.post("/", async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     const user = new User({ name, email, password });
//     await user.save();
//     res.status(201).json(user);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// module.exports = router;
// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

// POST /api/google-login
router.post("/google-login", async (req, res) => {
  try {
    const { name, email, googleId, picture } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = new User({ name, email, googleId, picture });
      await user.save();
    }

    res.status(200).json({
      message: "User logged in successfully",
      user,
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

