// //postsModel.js

// models/postsModel.js
// Add this field to your existing Post schema

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  postId: {
    type: String,
    unique: true,
    default: () => `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  articleNumber: {
    type: String,
    required: true
  },
  articleTitle: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  // ⭐ ADD THIS NEW FIELD ⭐
  replyToPostId: {
    type: String,
    default: null,
    index: true // Index for faster queries
  },
  agreeCount: {
    type: Number,
    default: 0
  },
  disagreeCount: {
    type: Number,
    default: 0
  },
  agreeList: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  disagreeList: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  posts: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Your existing methods...
postSchema.methods.hasUserResponded = function(userId) {
  const userIdStr = userId.toString();
  const hasAgreed = this.agreeList.some(item => item.userId.toString() === userIdStr);
  const hasDisagreed = this.disagreeList.some(item => item.userId.toString() === userIdStr);
  return hasAgreed || hasDisagreed;
};

postSchema.methods.addAgree = async function(userId) {
  this.agreeList.push({ userId });
  this.agreeCount = this.agreeList.length;
  await this.save();
};

postSchema.methods.addDisagree = async function(userId) {
  this.disagreeList.push({ userId });
  this.disagreeCount = this.disagreeList.length;
  await this.save();
};

postSchema.statics.getPostStats = async function(postId) {
  const post = await this.findOne({ postId }).lean();
  if (!post) return null;
  
  return {
    postId: post.postId,
    agreeCount: post.agreeCount,
    disagreeCount: post.disagreeCount,
    totalResponses: (post.agreeCount || 0) + (post.disagreeCount || 0),
    postsCount: post.posts ? post.posts.length : 0
  };
};

module.exports = mongoose.model('Post', postSchema);

// const mongoose = require("mongoose");

// const postSchema = new mongoose.Schema(
//   {
//     // Auto-generated unique post identifier
//     postId: {
//       type: String,
//       unique: true,
//       index: true
//     },
    
//     // Reference to the user who created the post
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//       index: true
//     },
    
//     // Article number (e.g., "Article 14")
//     articleNumber: {
//       type: String,
//       required: true,
//       index: true
//     },
    
//     // Article title
//     articleTitle: {
//       type: String,
//       required: true
//     },
    
//     // Post content/description
//     content: {
//       type: String,
//       required: true,
//       maxlength: 5000
//     },
    
//     // Count of users who agreed (increments when user clicks Agree)
//     agreeCount: {
//       type: Number,
//       default: 0,
//       min: 0
//     },
    
//     // Count of users who disagreed (increments when user clicks Disagree)
//     disagreeCount: {
//       type: Number,
//       default: 0,
//       min: 0
//     },
    
//     // Array to track which users have responded (to prevent duplicate votes)
//     responses: [{
//       userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//       },
//       stance: {
//         type: String,
//         enum: ['agree', 'disagree'],
//         required: true
//       },
//       respondedAt: {
//         type: Date,
//         default: Date.now
//       }
//     }]
//     ,
//     // Store free-text posts/comments by users
//     posts: [{
//       userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//       text: { type: String, maxlength: 2000 },
//       createdAt: { type: Date, default: Date.now }
//     }]
//   },
//   { 
//     timestamps: true // Automatically adds createdAt and updatedAt
//   }
// );

// // Compound index to quickly check if user has already responded
// postSchema.index({ postId: 1, 'responses.userId': 1 });

// // Pre-save hook to generate unique postId
// // Helper to generate an 8-char uppercase alphanumeric postId
// function generateShortId() {
//   const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//   let result = "";
//   for (let i = 0; i < 8; i++) {
//     result += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return result;
// }

// // Ensure a unique 8-char postId is assigned before saving
// postSchema.pre('save', async function(next) {
//   if (this.postId) return next();

//   let newId;
//   let exists = true;

//   while (exists) {
//     newId = generateShortId();
//     // eslint-disable-next-line no-await-in-loop
//     const found = await mongoose.models.Post.findOne({ postId: newId });
//     if (!found) exists = false;
//   }

//   this.postId = newId;
//   next();
// });

// // Method to check if user has already responded to this post
// postSchema.methods.hasUserResponded = function(userId) {
//   return this.responses.some(r => r.userId.toString() === userId.toString());
// };

// // Method to add agree response
// postSchema.methods.addAgree = async function(userId) {
//   if (this.hasUserResponded(userId)) {
//     throw new Error('User has already responded to this post');
//   }
  
//   this.agreeCount += 1;
//   this.responses.push({ userId, stance: 'agree' });
//   await this.save();
//   return this;
// };

// // Method to add disagree response
// postSchema.methods.addDisagree = async function(userId) {
//   if (this.hasUserResponded(userId)) {
//     throw new Error('User has already responded to this post');
//   }
  
//   this.disagreeCount += 1;
//   this.responses.push({ userId, stance: 'disagree' });
//   await this.save();
//   return this;
// };

// // Static method to get post statistics
// postSchema.statics.getPostStats = async function(postId) {
//   const post = await this.findOne({ postId });
//   if (!post) return null;
  
//   return {
//     postId: post.postId,
//     agreeCount: post.agreeCount,
//     disagreeCount: post.disagreeCount,
//     totalResponses: post.agreeCount + post.disagreeCount
//   };
// };

// // Static method to get user's posts
// postSchema.statics.getPostsByUserId = async function(userId) {
//   return await this.find({ userId })
//     .sort({ createdAt: -1 });
// };

// // Static method to get trending posts
// postSchema.statics.getTrendingPosts = async function() {
//   // Use 40 hours window as requested
//   const fortyHoursAgo = new Date(Date.now() - 40 * 60 * 60 * 1000);

//   return await this.aggregate([
//     // Add field recentResponses = number of responses in last 40 hours
//     {
//       $addFields: {
//         recentResponses: {
//           $size: {
//             $filter: {
//               input: '$responses',
//               as: 'response',
//               cond: { $gte: ['$$response.respondedAt', fortyHoursAgo] }
//             }
//           }
//         }
//       }
//     },
//     // Match posts that have any recentResponses (optional: include zeros if you want all)
//     {
//       $match: {
//         recentResponses: { $gt: 0 }
//       }
//     },
//     // Sort by total recent responses (agree + disagree in timeframe)
//     {
//       $sort: { recentResponses: -1 }
//     },
//     // Project useful fields
//     {
//       $project: {
//         userId: 1,
//         postId: 1,
//         articleNumber: 1,
//         articleTitle: 1,
//         content: 1,
//         agreeCount: 1,
//         disagreeCount: 1,
//         recentResponses: 1
//       }
//     }
//   ]).exec();
// };

// const Post = mongoose.model("Post", postSchema);
// module.exports = Post;