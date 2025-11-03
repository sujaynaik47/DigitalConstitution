//userModel.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // Required for expert/lawmaker accounts
    password: {
      type: String,
      required: false, // Optional for Google users
    },
    // Used primarily for Google Sign-In authentication
    googleId: {
      type: String,
      required: false, 
      unique: true,     // <-- This is the problem
      sparse: true,   // <-- This is the solution
    },

    picture: {
      type: String, // profile image from Google
    },
    role: {
        type: String,
        enum: ['Citizen', 'Expert', 'Lawmaker'],
        default: 'Citizen',
    }
  },
  { timestamps: true }
);

// NOTE: In a real application, you would add a pre-save hook here to
// hash the password before saving (e.g., using bcrypt).
/*
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});
*/

const User = mongoose.model("User", userSchema);
module.exports = User;

