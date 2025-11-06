// dummyDataScript.js

require("dotenv").config({ path: __dirname + "/.env" });
const mongoose = require("mongoose");
const User = require("./models/userModel"); // Adjust path if needed

// --- Custom Short UUID Generator ---
function generateShortUUID() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// --- MongoDB Connection URI ---
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is undefined. Check your .env file.");
  process.exit(1);
}

async function seedUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Optional: clear existing users for clean test run
    await User.deleteMany({});
    console.log("🧹 Cleared existing users collection");

    // --- 10 Dummy Users ---
    const users = [
        {
          name: "Dr. Jane Lawson",
          email: "jane.lawson@example.com",
          password: "12345678",
          role: "Expert",
          userId: generateShortUUID(),
        },
      {
        name: "Michael Torres",
        email: "michael.torres@lawfirm.org",
        password: "12345678",
        role: "Expert",
        userId: generateShortUUID(),
      },
      {
        name: "Alex Green",
        email: "alex.green@gmail.com",
        googleId: "alex.green@gmail.com",
        role: "Citizen",
        picture: "https://example.com/alex-green.png",
        password: "12345678",
        userId: generateShortUUID(),
      },
      {
        name: "Priya Mehta",
        email: "priya.mehta@gmail.com",
        googleId: "priya.mehta@gmail.com",
        role: "Citizen",
        picture: "https://example.com/priya.png",
        password: "12345678",
        userId: generateShortUUID(),
      },
      {
        name: "Samuel Carter",
        email: "samuel.carter@lawfirm.org",
        password: "12345678",
        role: "Expert",
        userId: generateShortUUID(),
      },
      {
        name: "Linda Park",
        email: "linda.park@example.com",
        password: "12345678",
        role: "Expert",
        userId: generateShortUUID(),
      },
      {
        name: "Carlos Rivera",
        email: "carlos.rivera@gmail.com",
        googleId: "carlos.rivera@gmail.com",
        role: "Citizen",
        picture: "https://example.com/carlos.png",
        password: "12345678",
        userId: generateShortUUID(),
      },
      {
        name: "Emily Chen",
        email: "emily.chen@gmail.com",
        googleId: "emily.chen@gmail.com",
        role: "Citizen",
        picture: "https://example.com/emily.png",
        password: "12345678",
        userId: generateShortUUID(),
      },
      {
        name: "Robert Evans",
        email: "robert.evans@lawfirm.org",
        password: "12345678",
        role: "Expert",
        userId: generateShortUUID(),
      },
      {
        name: "Sofia Rossi",
        email: "sofia.rossi@gmail.com",
        googleId: "sofia.rossi@gmail.com",
        role: "Citizen",
        picture: "https://example.com/sofia.png",
        password: "12345678",
        userId: generateShortUUID(),
      },
    ];

    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log("✅ Inserted users successfully!\n");

    createdUsers.forEach((u, index) => {
      console.log(
        `${index + 1}. ${u.name} (${u.role}) -> ${u.email} | userId: ${u.userId}`
      );
    });

    console.log("\n🎉 All users seeded successfully!");
  } catch (err) {
    console.error("❌ Error seeding users:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

seedUsers();
