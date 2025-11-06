// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

// Mock password check (replace with bcrypt.compare in production)
const mockPasswordCheck = (storedPassword, providedPassword) => {
  return storedPassword === providedPassword;
};

// Mask email but NOT uuid
function maskEmailOrGoogleId(value) {
  if (!value || value.length < 10) return "****";
  return "****" + value.slice(4, 8) + "**" + value.slice(10);
}

function formatUser(user) {
  return {
    name: user.name,
    email: maskEmailOrGoogleId(user.email),
    googleId: user.googleId ? maskEmailOrGoogleId(user.googleId) : undefined,
    role: user.role,
    uuid: user.uuid, // <-- full unique ID
    picture: user.picture,
  };
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

    res.status(200).json({ message: "User logged in successfully", user: formatUser(user) });
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

    res.status(201).json({ message: "Registration successful", user: formatUser(newUser) });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// --- Login ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Invalid credentials." });
    if (!user.password) return res.status(401).json({ message: "Citizen account. Use Google Sign-In." });

    const isMatch = mockPasswordCheck(user.password, password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials." });

    res.status(200).json({ message: "Login successful", user: formatUser(user) });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;









// // // const express = require("express");
// // // // const User = require("../models/userModel");

// // // // const router = express.Router();

// // // // // ✅ Get all users
// // // // router.get("/", async (req, res) => {
// // // //   try {
// // // //     const users = await User.find();
// // // //     res.json(users);
// // // //   } catch (error) {
// // // //     res.status(500).json({ message: error.message });
// // // //   }
// // // // });

// // // // // ✅ Add new user
// // // // router.post("/", async (req, res) => {
// // // //   const { name, email, password } = req.body;
// // // //   try {
// // // //     const user = new User({ name, email, password });
// // // //     await user.save();
// // // //     res.status(201).json(user);
// // // //   } catch (error) {
// // // //     res.status(400).json({ message: error.message });
// // // //   }
// // // // });

// // // // module.exports = router;
// // // // routes/userRoutes.js
// // // const express = require("express");
// // // const router = express.Router();
// // // const User = require("../models/userModel");

// // // // POST /api/google-login
// // // router.post("/google-login", async (req, res) => {
// // //   try {
// // //     const { name, email, googleId, picture } = req.body;

// // //     if (!email || !googleId) {
// // //       return res.status(400).json({ message: "Missing required fields" });
// // //     }

// // //     // Check if user already exists
// // //     let user = await User.findOne({ email });

// // //     if (!user) {
// // //       // Create new user
// // //       user = new User({ name, email, googleId, picture });
// // //       await user.save();
// // //     }

// // //     res.status(200).json({
// // //       message: "User logged in successfully",
// // //       user,
// // //     });
// // //   } catch (error) {
// // //     console.error("Google login error:", error);
// // //     res.status(500).json({ message: "Server error" });
// // //   }
// // // });

// // // module.exports = router;

// // const express = require("express");
// // const router = express.Router();
// // const User = require("../models/userModel");

// // // POST /api/users/google-login
// // router.post("/google-login", async (req, res) => {
// //   try {
// //     const { name, email, picture } = req.body;

// //     if (!email) {
// //       return res.status(400).json({ message: "Email is required" });
// //     }

// //     // Check if user already exists
// //     let user = await User.findOne({ email });

// //     if (!user) {
// //       // Create a new user (no googleId since frontend doesn't send it)
// //       user = new User({
// //         name,
// //         email,
// //         picture,
// //         googleId: email, // optional fallback — ensures uniqueness
// //       });
// //       await user.save();
// //     }

// //     res.status(200).json({
// //       message: "User logged in successfully",
// //       user,
// //     });
// //   } catch (error) {
// //     console.error("Google login error:", error);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // });

// // module.exports = router;



// const express = require("express");
// const router = express.Router();
// const User = require("../models/userModel");
// // NOTE: In a real application, you would require your hashing library here:
// // const bcrypt = require('bcrypt');

// // Helper function to mock password check (replace with bcrypt.compare in production)
// const mockPasswordCheck = (storedPassword, providedPassword) => {
//     // In a real app, you'd use: return bcrypt.compare(providedPassword, storedPassword);
//     return storedPassword === providedPassword;
// };

// // --- 1. Google Login / Registration (Citizen Flow) ---
// // POST /api/users/google-login
// router.post("/google-login", async (req, res) => {
//   try {
//     const { name, email, picture } = req.body;

//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }

//     // Check if user already exists by email
//     let user = await User.findOne({ email });

//     if (!user) {
//       // Create a new user (Citizen role, associated with a mock googleId)
//       user = new User({
//         name,
//         email,
//         picture,
//         googleId: email, // Using email as a mock unique ID
//         role: 'Citizen',
//       });
//       await user.save();
//     } else if (!user.googleId) {
//         // If the email exists but doesn't have a Google ID (i.e., it's an Expert account)
//         return res.status(403).json({ message: "This email is registered as an Expert account. Please use the Expert login tab." });
//     }

//     // Success response
//     res.status(200).json({
//       message: "User logged in successfully",
//       name: user.name,
//       email: user.email,
//       role: user.role,
//     });
//   } catch (error) {
//     console.error("Google login error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // --- 2. Expert/Lawmaker Registration (Signup) ---
// // POST /api/users/register
// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password, googleId } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "All fields are required for registration." });
//     }

//     // Check for existing user
//     if (await User.findOne({ email })) {
//       return res.status(409).json({ message: "User already exists. Please login." });
//     }

//     // ✅ Build user data dynamically
//     const userData = {
//       name,
//       email,
//       password, // (In real apps, hash before saving)
//       role: "Expert",
//     };

//     // ⚠ Add googleId only if provided (for safety)
//     if (googleId) {
//       userData.googleId = googleId;
//     }

//     const newUser = new User(userData);
//     await newUser.save();

//     res.status(201).json({
//       message: "Registration successful. Please log in.",
//       name: newUser.name,
//       email: newUser.email,
//       role: newUser.role,
//     });
//   } catch (error) {
//     console.error("Expert registration error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // --- 3. Expert/Lawmaker Login ---
// // POST /api/users/login
// router.post("/login", async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return res.status(400).json({ message: "Email and password are required." });
//         }

//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(404).json({ message: "Invalid credentials." });
//         }

//         // Check if the account has a password set (i.e., is not a Google-only account)
//         if (!user.password) {
//             return res.status(401).json({ message: "This email is associated with a Citizen account. Please use Google Sign-In." });
//         }

//         // MOCK: Compare the provided password with the stored password
//         const isMatch = mockPasswordCheck(user.password, password);

//         if (!isMatch) {
//             return res.status(401).json({ message: "Invalid credentials." });
//         }

//         // Success response
//         res.status(200).json({
//             message: "Login successful",
//             name: user.name,
//             email: user.email,
//             role: user.role,
//         });

//     } catch (error) {
//         console.error("Expert login error:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// });

// module.exports = router;
