// models/postsModel.js
const mongoose = require("mongoose");

// Helper to generate an 8-char uppercase alphanumeric postId
function generateShortId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const postSchema = new mongoose.Schema(
  {
    // Auto-generated unique post identifier (8-char alphanumeric)
    postId: {
      type: String,
      unique: true,
      index: true
    },
    
    // Reference to the user who created the post
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    
    // Article number (e.g., "Article 14")
    articleNumber: {
      type: String,
      required: true,
      index: true
    },
    
    // Article title
    articleTitle: {
      type: String,
      required: true
    },
    
    // Post content/description
    content: {
      type: String,
      required: true,
      maxlength: 5000
    },
    
    // Reply to another post (for threading)
    replyToPostId: {
      type: String,
      default: null,
      index: true
    },
    
    // Count of users who agreed
    agreeCount: {
      type: Number,
      default: 0,
      min: 0
    },
    
    // Count of users who disagreed
    disagreeCount: {
      type: Number,
      default: 0,
      min: 0
    },
    
    // List of users who agreed
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
    
    // List of users who disagreed
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
    
    // Store free-text posts/comments by users
    posts: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      text: {
        type: String,
        maxlength: 2000
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }]
  },
  { 
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

// Ensure a unique 8-char postId is assigned before saving
postSchema.pre('save', async function(next) {
  if (this.postId) return next();

  let newId;
  let exists = true;

  while (exists) {
    newId = generateShortId();
    const found = await mongoose.models.Post.findOne({ postId: newId });
    if (!found) exists = false;
  }

  this.postId = newId;
  next();
});

// Method to check if user has already responded to this post
postSchema.methods.hasUserResponded = function(userId) {
  const userIdStr = userId.toString();
  const hasAgreed = this.agreeList.some(item => item.userId.toString() === userIdStr);
  const hasDisagreed = this.disagreeList.some(item => item.userId.toString() === userIdStr);
  return hasAgreed || hasDisagreed;
};

// Method to add agree response
postSchema.methods.addAgree = async function(userId) {
  if (this.hasUserResponded(userId)) {
    throw new Error('User has already responded to this post');
  }
  
  this.agreeList.push({ userId });
  this.agreeCount = this.agreeList.length;
  await this.save();
  return this;
};

// Method to add disagree response
postSchema.methods.addDisagree = async function(userId) {
  if (this.hasUserResponded(userId)) {
    throw new Error('User has already responded to this post');
  }
  
  this.disagreeList.push({ userId });
  this.disagreeCount = this.disagreeList.length;
  await this.save();
  return this;
};

// Static method to get post statistics
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

// Static method to get user's posts
postSchema.statics.getPostsByUserId = async function(userId) {
  return await this.find({ userId })
    .sort({ createdAt: -1 });
};

const Post = mongoose.model("Post", postSchema);
module.exports = Post;