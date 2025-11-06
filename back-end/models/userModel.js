const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: uuidv4, // generates a new UUID when user is created
      unique: true,    // ensures no duplicates
      immutable: true, // prevents changes after creation
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    googleId: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },
    picture: {
      type: String,
    },
    role: {
      type: String,
      enum: ["Citizen", "Expert", "Lawmaker"],
      default: "Citizen",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
