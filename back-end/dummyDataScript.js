// // dummyDataScript.js

require("dotenv").config(); // load .env variables
const mongoose = require("mongoose");
const User = require("./models/userModel"); // adjust path if needed

const MONGO_URI = process.env.MONGO_URI;

async function seedUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear old users (optional)
    await User.deleteMany({});
    console.log("🗑️ Cleared old User documents");

    const roles = ["Citizen", "Expert", "Lawmaker"];
    const insertedUsers = [];

    for (let i = 1; i <= 10; i++) {
      const user = new User({
        name: `User${i}`,
        email: `u${i}@x.io`,
        password: "12341234",
        role: roles[i % 3],
      });

      await user.save();
      insertedUsers.push(user);
      console.log(`👤 Inserted: ${user.name}`);
    }

    console.log("🎉 All dummy users inserted:", insertedUsers);

    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding users:", err);
    process.exit(1);
  }
}

seedUsers();
























// require("dotenv").config(); // load .env variables
// const mongoose = require("mongoose");
// const Opinion = require("./models/postsModel"); // adjust path if needed

// const MONGO_URI = process.env.MONGO_URI;

// async function seed() {
//   try {
//     await mongoose.connect(MONGO_URI);
//     console.log("✅ Connected to MongoDB");

//     // Clear old data (optional)
//     await Opinion.deleteMany({});
//     console.log("🗑️ Cleared old Opinion documents");

//     // Dummy user ObjectIds (replace with real User IDs if you have them)
//     const user1 = new mongoose.Types.ObjectId();
//     const user2 = new mongoose.Types.ObjectId();
//     const user3 = new mongoose.Types.ObjectId();

//     const dummyOpinions = [
//       {
//         userId: user1,
//         articleNumber: "Article 14",
//         articleTitle: "Equality before Law",
//         content: "I believe Article 14 ensures fairness and justice for all citizens.",
//       },
//       {
//         userId: user2,
//         articleNumber: "Article 19",
//         articleTitle: "Freedom of Speech",
//         content: "Freedom of speech is essential, but it must be balanced with responsibility.",
//       },
//       {
//         userId: user3,
//         articleNumber: "Article 21",
//         articleTitle: "Right to Life",
//         content: "The right to life is the foundation of all other rights.",
//       },
//     ];

//     const inserted = [];

//     // Save each opinion individually so pre('save') runs
//     for (const data of dummyOpinions) {
//       const opinion = new Opinion(data);
//       await opinion.save(); // triggers pre('save') and generates postId
//       inserted.push(opinion);
//     }

//     console.log("🎉 Inserted dummy opinions:", inserted);

//     process.exit(0);
//   } catch (err) {
//     console.error("❌ Error seeding data:", err);
//     process.exit(1);
//   }
// }

// seed();
