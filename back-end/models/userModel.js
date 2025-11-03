// // const mongoose = require("mongoose");

// // const userSchema = new mongoose.Schema(
// //   {
// //     name: {
// //       type: String,
// //       required: true,
// //     },
// //     email: {
// //       type: String,
// //       required: true,
// //       unique: true,
// //     },
// //     password: {
// //       type: String,
// //       required: true,
// //     },
// //   },
// //   { timestamps: true }
// // );

// // const User = mongoose.model("User", userSchema);

// // module.exports = User;
// // models/userModel.js
// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     googleId: {
//       type: String, // unique Google account ID
//       required: true,
//       unique: true,
//     },
//     picture: {
//       type: String, // profile image from Google
//     },
//   },
//   { timestamps: true }
// );

// const User = mongoose.model("User", userSchema);
// module.exports = User;



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
      required: false, // Optional for expert users
      unique: true,
      sparse: true, // Allows multiple documents to have a null googleId
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

