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


// // models/userModel.js
// const mongoose = require("mongoose");

// // Helper: generate a unique 8-character alphanumeric string (A–Z + 0–9)
// function generateShortUUID() {
//   const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//   let result = "";
//   for (let i = 0; i < 8; i++) {
//     result += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return result;
// }

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String },
//   googleId: { type: String },
//   role: { type: String, enum: ["Citizen", "Expert"], default: "Citizen" },
//   picture: { type: String },
//   uuid: { type: String, unique: true, index: true }, // ✅ Short, unique UUID
// });

// // --- Auto-assign unique 8-char UUID before saving ---
// userSchema.pre("save", async function (next) {
//   if (this.uuid) return next(); // Skip if already has one

//   let newUUID;
//   let exists = true;

//   // Loop until we find a truly unique one
//   while (exists) {
//     newUUID = generateShortUUID();
//     const existing = await mongoose.models.User.findOne({ uuid: newUUID });
//     if (!existing) exists = false;
//   }

//   this.uuid = newUUID;
//   next();
// });

// const User = mongoose.model("User", userSchema);
// module.exports = User;
