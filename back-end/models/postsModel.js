const mongoose = require("mongoose");

const opinionSchema = new mongoose.Schema(
  {
    // Auto-generated unique post identifier
    postId: {
      type: String,
      required: true,
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
    
    // Count of users who agreed (increments when user clicks Agree)
    agreeCount: {
      type: Number,
      default: 0,
      min: 0
    },
    
    // Count of users who disagreed (increments when user clicks Disagree)
    disagreeCount: {
      type: Number,
      default: 0,
      min: 0
    },
    
    // Array to track which users have responded (to prevent duplicate votes)
    responses: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      stance: {
        type: String,
        enum: ['agree', 'disagree'],
        required: true
      },
      respondedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  { 
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

// Compound index to quickly check if user has already responded
opinionSchema.index({ postId: 1, 'responses.userId': 1 });

// Pre-save hook to generate unique postId
opinionSchema.pre('save', async function(next) {
  if (!this.postId) {
    // Generate unique postId like "pld-123"
    const count = await this.constructor.countDocuments();
    this.postId = `pld-${count + 1}`;
  }
  next();
});

// Method to check if user has already responded to this post
opinionSchema.methods.hasUserResponded = function(userId) {
  return this.responses.some(r => r.userId.toString() === userId.toString());
};

// Method to add agree response
opinionSchema.methods.addAgree = async function(userId) {
  if (this.hasUserResponded(userId)) {
    throw new Error('User has already responded to this post');
  }
  
  this.agreeCount += 1;
  this.responses.push({ userId, stance: 'agree' });
  await this.save();
  return this;
};

// Method to add disagree response
opinionSchema.methods.addDisagree = async function(userId) {
  if (this.hasUserResponded(userId)) {
    throw new Error('User has already responded to this post');
  }
  
  this.disagreeCount += 1;
  this.responses.push({ userId, stance: 'disagree' });
  await this.save();
  return this;
};

// Static method to get post statistics
opinionSchema.statics.getPostStats = async function(postId) {
  const post = await this.findOne({ postId });
  if (!post) return null;
  
  return {
    postId: post.postId,
    agreeCount: post.agreeCount,
    disagreeCount: post.disagreeCount,
    totalResponses: post.agreeCount + post.disagreeCount
  };
};

// Static method to get user's posts
opinionSchema.statics.getPostsByUserId = async function(userId) {
  return await this.find({ userId })
    .sort({ createdAt: -1 });
};

// Static method to get trending posts
opinionSchema.statics.getTrendingPosts = async function() {
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
  
  return await this.aggregate([
    // Match posts with responses in last 48 hours
    {
      $match: {
        'responses.respondedAt': { $gte: fortyEightHoursAgo }
      }
    },
    // Add fields for recent response counts
    {
      $addFields: {
        recentResponses: {
          $size: {
            $filter: {
              input: '$responses',
              as: 'response',
              cond: { $gte: ['$$response.respondedAt', fortyEightHoursAgo] }
            }
          }
        }
      }
    },
    // Sort by total recent responses
    {
      $sort: { recentResponses: -1 }
    },
    // Project only needed fields
    {
      $project: {
        userId: 1,
        postId: 1,
        articleNumber: 1,
        articleTitle: 1,
        content: 1,
        agreeCount: 1,
        disagreeCount: 1,
        recentResponses: 1
      }
    }
  ]).exec();
};

const Opinion = mongoose.model("Opinion", opinionSchema);
module.exports = Opinion;