// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

// Mock password check (replace with bcrypt.compare in production)
const mockPasswordCheck = (storedPassword, providedPassword) => {
  return storedPassword === providedPassword;
};

// Mask email but NOT userId
function maskEmailOrGoogleId(value) {
  if (!value || value.length < 10) return "****";
  return "****" + value.slice(4, 8) + "**" + value.slice(10);
}

function formatUser(user) {
  // Ensure userId is always included
  const formattedUser = {
    name: user.name || "User",
    email: maskEmailOrGoogleId(user.email),
    role: user.role || "Citizen",
    userId: user.userId || user._id.toString().slice(-8), // Fallback to last 8 chars of _id
    postsCount: user.posts ? user.posts.length : 0
  };

  // Only add googleId if it exists
  if (user.googleId) {
    formattedUser.googleId = maskEmailOrGoogleId(user.googleId);
  }

  // Only add picture if it exists
  if (user.picture) {
    formattedUser.picture = user.picture;
  }

  return formattedUser;
}

// --- Google Login ---
router.post("/google-login", async (req, res) => {
  try {
    const { name, email, picture } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
    
    let user = await User.findOne({ email });
    
    if (!user) {
      user = new User({ name, email, picture, googleId: email, role: "Citizen" });
      await user.save();
    } else if (!user.googleId) {
      return res.status(403).json({ message: "This email is registered as an Expert account." });
    }
    
    const formattedUser = formatUser(user);
    
    res.status(200).json({ 
      message: "User logged in successfully", 
      user: formattedUser 
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// --- Register ---
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, googleId } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    
    if (await User.findOne({ email })) {
      return res.status(409).json({ message: "User already exists." });
    }
    
    const newUser = new User({ name, email, password, role: "Expert", googleId });
    await newUser.save();
    
    const formattedUser = formatUser(newUser);
    
    res.status(201).json({ 
      message: "Registration successful", 
      user: formattedUser 
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// --- Login ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required." });
    }
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: "Invalid credentials." });
    }
    
    if (!user.password) {
      return res.status(401).json({ message: "Citizen account. Use Google Sign-In." });
    }
    
    const isMatch = mockPasswordCheck(user.password, password);
    
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    
    const formattedUser = formatUser(user);
    
    res.status(200).json({ 
      message: "Login successful", 
      user: formattedUser 
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// --- Get user by userId (for displaying user info/role) ---
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user by userId string (not MongoDB _id)
    const user = await User.findOne({ userId }).select('userId role name email').lean();
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ 
      user: {
        userId: user.userId,
        role: user.role,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;