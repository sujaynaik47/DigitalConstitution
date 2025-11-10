// models/userModel.js

const mongoose = require("mongoose");

function generateShortUserId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  role: { type: String },
  googleId: { type: String },
  picture: { type: String },
  // New unique 8-char uppercase alphanumeric userId
  userId: { type: String, unique: true, index: true },
});

// Ensure a unique userId (8 chars A-Z0-9) is assigned before saving
userSchema.pre("save", async function (next) {
  if (this.userId) return next();

  let newId;
  let exists = true;

  // loop until we find a unique id
  while (exists) {
    newId = generateShortUserId();
    // Check against the model directly
    // eslint-disable-next-line no-await-in-loop
    const found = await mongoose.models.User.findOne({ userId: newId });
    if (!found) exists = false;
  }

  this.userId = newId;
  next();
});

module.exports = mongoose.model("User", userSchema);
