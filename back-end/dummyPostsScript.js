// seedPosts.js
// Script to insert 3 posts for each user into the posts collection

const mongoose = require('mongoose');
const Opinion = require('./models/postsModel'); // Adjust path as needed
const User = require('./models/userModel'); // Adjust path as needed
require("dotenv").config({ path: __dirname + "/.env" });

// MongoDB connection string - update with your actual connection string
const MONGO_URI = process.env.MONGO_URI;


// User data with their userIds
const users = [
  { name: 'Dr. Jane Lawson', userId: 'PJZ5MA1L', type: 'Expert' },
  { name: 'Michael Torres', userId: 'BSZ7M4ED', type: 'Expert' },
  { name: 'Alex Green', userId: 'RYQP9CFV', type: 'Citizen' },
  { name: 'Priya Mehta', userId: 'WG0H7KAE', type: 'Citizen' },
  { name: 'Samuel Carter', userId: 'XQRKSGVA', type: 'Expert' },
  { name: 'Linda Park', userId: '0VYLOHWS', type: 'Expert' },
  { name: 'Carlos Rivera', userId: 'L25PT672', type: 'Citizen' },
  { name: 'Emily Chen', userId: 'TQH9851E', type: 'Citizen' },
  { name: 'Robert Evans', userId: '0X5TBPUS', type: 'Expert' },
  { name: 'Sofia Rossi', userId: 'QFMWINK6', type: 'Citizen' }
];

// Sample articles from Indian Constitution
const articles = [
  { number: 'Article 14', title: 'Equality before law' },
  { number: 'Article 19', title: 'Protection of certain rights regarding freedom of speech, etc.' },
  { number: 'Article 21', title: 'Protection of life and personal liberty' },
  { number: 'Article 25', title: 'Freedom of conscience and free profession, practice and propagation of religion' },
  { number: 'Article 32', title: 'Remedies for enforcement of rights conferred by this Part' },
  { number: 'Article 44', title: 'Uniform civil code for the citizens' },
  { number: 'Article 51A', title: 'Fundamental Duties' },
  { number: 'Article 226', title: 'Power of High Courts to issue certain writs' },
  { number: 'Article 370', title: 'Temporary provisions with respect to the State of Jammu and Kashmir' },
  { number: 'Article 356', title: "Provisions in case of failure of constitutional machinery in States" }
];

// Sample post contents based on user type
const expertContents = [
  "From a legal perspective, this provision requires careful interpretation considering recent Supreme Court judgments and their implications on constitutional law.",
  "The legislative intent behind this article reflects a balance between individual rights and state interests, which has evolved significantly through judicial precedents.",
  "This constitutional provision has been the subject of extensive debate in legal circles, particularly regarding its application in contemporary scenarios.",
  "Analyzing the historical context and framers' intent is crucial to understanding the full scope and limitations of this article.",
  "The intersection of this provision with other constitutional articles creates a complex legal framework that demands nuanced understanding.",
  "Recent amendments and judicial interpretations have significantly altered the practical application of this fundamental provision.",
  "Constitutional scholars have debated the original intent versus modern interpretation of this article for decades.",
  "The balance between federal and state powers in this context requires careful examination of constitutional principles.",
  "This provision represents a cornerstone of our constitutional democracy and has been tested numerous times in courts.",
  "The evolving nature of constitutional interpretation means this article must be understood in light of changing societal needs."
];

const citizenContents = [
  "This article directly impacts our daily lives and should be more accessible to common citizens. I believe greater public awareness is needed.",
  "As a concerned citizen, I think this provision needs to be reconsidered in light of modern challenges we face today.",
  "My personal experience has shown me how important this constitutional right is for protecting ordinary people like us.",
  "I strongly support this article as it safeguards our fundamental freedoms that we often take for granted.",
  "There should be more public discussion about this provision so people understand their rights better.",
  "In my opinion, this article needs better implementation at the ground level to truly benefit all citizens.",
  "This constitutional provision gives me hope that justice is accessible to everyone, regardless of their background.",
  "I believe this article should be taught in schools so young people understand their constitutional rights from an early age.",
  "More transparency is needed in how this provision is applied in real-world situations affecting common people.",
  "This article is crucial for maintaining the democratic fabric of our society and protecting minority rights."
];

// Function to get random element from array
function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Function to get random number between min and max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate posts for a user
function generatePostsForUser(user, userObjectId) {
  const posts = [];
  const isExpert = user.type === 'Expert';
  const contentPool = isExpert ? expertContents : citizenContents;
  
  // Use a copy of articles array to avoid duplicates for same user
  const availableArticles = [...articles];
  
  for (let i = 0; i < 3; i++) {
    // Pick a random article and remove it from available pool
    const articleIndex = Math.floor(Math.random() * availableArticles.length);
    const article = availableArticles.splice(articleIndex, 1)[0];
    
    const post = {
      userId: userObjectId,
      articleNumber: article.number,
      articleTitle: article.title,
      content: getRandom(contentPool),
      agreeCount: getRandomInt(5, 50),
      disagreeCount: getRandomInt(3, 40),
      responses: []
    };
    
    posts.push(post);
  }
  
  return posts;
}

// Main function to seed the database
async function seedPosts() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected successfully!');
    
    console.log('\nClearing existing posts...');
    await Opinion.deleteMany({});
    console.log('Existing posts cleared.');
    
    console.log('\nGenerating posts for users...\n');
    
    for (const user of users) {
      // Find the user's MongoDB ObjectId using their userId
      const userDoc = await User.findOne({ userId: user.userId });
      
      if (!userDoc) {
        console.log(`❌ User not found: ${user.name} (${user.userId})`);
        continue;
      }
      
      // Generate 3 posts for this user
      const postsData = generatePostsForUser(user, userDoc._id);
      
      const insertedPosts = [];
      
      // Create and save posts one by one to trigger pre-save hook
      for (const postData of postsData) {
        const post = new Opinion(postData);
        const savedPost = await post.save();
        insertedPosts.push(savedPost);
      }
      
      console.log(`✅ Created ${insertedPosts.length} posts for ${user.name} (${user.userId})`);
      insertedPosts.forEach((post, index) => {
        console.log(`   Post ${index + 1}: ${post.postId} - ${post.articleNumber}`);
      });
    }
    
    console.log('\n✨ Database seeding completed successfully!');
    
    // Display summary
    const totalPosts = await Opinion.countDocuments();
    console.log(`\nTotal posts in database: ${totalPosts}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  }
}

// Run the script
seedPosts();