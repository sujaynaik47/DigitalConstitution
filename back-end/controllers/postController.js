// controllers/postController.js

const Post = require('../models/postsModel');
const User = require('../models/userModel');

// ----------------------
// Create a new post
// ----------------------
const createPost = async (req, res) => {
  try {
    const { articleNumber, articleTitle, content, replyToPostId } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!articleNumber || !articleTitle || !content) {
      return res.status(400).json({
        message: 'Article number, title, and content are required',
      });
    }

    const postData = {
      userId,
      articleNumber,
      articleTitle,
      content,
    };

    // Add reference to parent post if this is a reply
    if (replyToPostId) {
      const parentPost = await Post.findOne({ postId: replyToPostId });
      if (parentPost) {
        postData.replyToPostId = replyToPostId;
      }
    }

    const newPost = await Post.create(postData);

    // Populate user info before sending response
    const populatedPost = await Post.findById(newPost._id)
      .populate('userId', 'userId role')
      .lean();

    res.status(201).json({
      message: 'Post created successfully',
      post: populatedPost,
    });
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ----------------------
// Get all posts
// ----------------------
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'userId role')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ posts });
  } catch (err) {
    console.error('Get posts error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ----------------------
// Get single post by postId
// ----------------------
const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findOne({ postId })
      .populate('userId', 'userId role')
      .lean();

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ post });
  } catch (err) {
    console.error('Get post error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ----------------------
// Agree with a post
// ----------------------
const agreeWithPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const post = await Post.findOne({ postId });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Prevent duplicate reactions
    if (post.hasUserResponded(userId)) {
      return res.status(400).json({
        message: 'You have already responded to this post',
      });
    }

    await post.addAgree(userId);

    res.status(200).json({
      message: 'Successfully agreed',
      agreeCount: post.agreeCount,
      disagreeCount: post.disagreeCount,
    });
  } catch (err) {
    console.error('Agree error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// ----------------------
// Disagree with a post
// ----------------------
const disagreeWithPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const post = await Post.findOne({ postId });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.hasUserResponded(userId)) {
      return res.status(400).json({
        message: 'You have already responded to this post',
      });
    }

    await post.addDisagree(userId);

    res.status(200).json({
      message: 'Successfully disagreed',
      agreeCount: post.agreeCount,
      disagreeCount: post.disagreeCount,
    });
  } catch (err) {
    console.error('Disagree error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// ----------------------
// Get post statistics
// ----------------------
const getPostStats = async (req, res) => {
  try {
    const { postId } = req.params;

    const stats = await Post.getPostStats(postId);
    if (!stats) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ stats });
  } catch (err) {
    console.error('Get stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ----------------------
// Get posts by article number (with threading)
// ----------------------
const getPostsByArticle = async (req, res) => {
  try {
    const { articleNumber } = req.params;

    const posts = await Post.find({ articleNumber })
      .populate('userId', 'userId role')
      .sort({ createdAt: -1 })
      .lean();

    // Organize posts into threads
    const topLevelPosts = posts.filter(p => !p.replyToPostId);
    const replies = posts.filter(p => p.replyToPostId);

    // Build threaded structure
    const threaded = topLevelPosts.map(post => {
      const postReplies = replies.filter(r => r.replyToPostId === post.postId);
      return {
        ...post,
        replies: postReplies
      };
    });

    res.status(200).json({ posts: threaded });
  } catch (err) {
    console.error('Get posts by article error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ----------------------
// Get all posts created by a specific user (MyActivity)
// ----------------------
const getMyPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID required' });
    }

    // Find user document first
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const posts = await Post.find({ userId: user._id })
      .populate('userId', 'userId role')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      posts,
      count: posts.length,
      userId,
    });
  } catch (err) {
    console.error('Get my posts error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ----------------------
// Get trending posts (based on total interactions)
// ----------------------
const getTrendingPosts = async (req, res) => {
  try {
    console.log('Fetching trending posts...');
    
    const posts = await Post.find()
      .populate('userId', 'userId role')
      .lean();

    console.log(`Found ${posts.length} total posts`);

    // Calculate interaction score for each post
    const postsWithScores = posts.map(post => {
      const fortyHoursAgo = new Date(Date.now() - 40 * 60 * 60 * 1000);
      
      let recentAgree = 0;
      let recentDisagree = 0;
      let recentPosts = 0;

      if (post.agreeList && Array.isArray(post.agreeList)) {
        recentAgree = post.agreeList.filter(
          item => item.timestamp && new Date(item.timestamp) >= fortyHoursAgo
        ).length;
      }

      if (post.disagreeList && Array.isArray(post.disagreeList)) {
        recentDisagree = post.disagreeList.filter(
          item => item.timestamp && new Date(item.timestamp) >= fortyHoursAgo
        ).length;
      }

      if (post.posts && Array.isArray(post.posts)) {
        recentPosts = post.posts.filter(
          item => item.timestamp && new Date(item.timestamp) >= fortyHoursAgo
        ).length;
      }

      const recentInteractions = recentAgree + recentDisagree + recentPosts;
      const totalInteractions = (post.agreeCount || 0) + (post.disagreeCount || 0);

      return {
        ...post,
        recentInteractions,
        totalInteractions,
        score: recentInteractions * 10 + totalInteractions
      };
    });

    const trending = postsWithScores
      .filter(p => p.recentInteractions > 0 || p.totalInteractions > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    console.log(`Returning ${trending.length} trending posts`);

    res.status(200).json({ 
      posts: trending,
      count: trending.length 
    });
  } catch (err) {
    console.error('Get trending posts error:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ 
      message: 'Server error',
      error: err.message 
    });
  }
};

// ----------------------
// Add a free-text post/comment to a post
// ----------------------
const addPostToPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const post = await Post.findOne({ postId });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.posts.push({ userId, text });
    await post.save();

    res.status(200).json({ message: 'Post added', postId: post.postId });
  } catch (err) {
    console.error('Add post error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ----------------------
// Export all
// ----------------------
module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  agreeWithPost,
  disagreeWithPost,
  getPostStats,
  getPostsByArticle,
  getMyPosts,
  getTrendingPosts,
  addPostToPost,
};

// const Post = require('../models/postsModel');
// const User = require('../models/userModel');

// // ----------------------
// // Create a new post
// // ----------------------
// const createPost = async (req, res) => {
//   try {
//     const { articleNumber, articleTitle, content } = req.body;
//     const userId = req.user?._id;

//     if (!userId) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     if (!articleNumber || !articleTitle || !content) {
//       return res.status(400).json({
//         message: 'Article number, title, and content are required',
//       });
//     }

//     const newPost = await Post.create({
//       userId,
//       articleNumber,
//       articleTitle,
//       content,
//     });

//     res.status(201).json({
//       message: 'Post created successfully',
//       post: newPost,
//     });
//   } catch (err) {
//     console.error('Create post error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // ----------------------
// // Get all posts
// // ----------------------
// const getAllPosts = async (req, res) => {
//   try {
//     const posts = await Post.find()
//       .populate('userId', 'userId role') // Include role in populate
//       .sort({ createdAt: -1 })
//       .lean();

//     res.status(200).json({ posts });
//   } catch (err) {
//     console.error('Get posts error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // ----------------------
// // Get single post by postId
// // ----------------------
// const getPostById = async (req, res) => {
//   try {
//     const { postId } = req.params;

//     const post = await Post.findOne({ postId })
//       .populate('userId', 'userId role') // Include role
//       .lean();

//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }

//     res.status(200).json({ post });
//   } catch (err) {
//     console.error('Get post error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // ----------------------
// // Agree with a post
// // ----------------------
// const agreeWithPost = async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const userId = req.user?._id;

//     if (!userId) return res.status(401).json({ message: 'Unauthorized' });

//     const post = await Post.findOne({ postId });
//     if (!post) return res.status(404).json({ message: 'Post not found' });

//     // Prevent duplicate reactions
//     if (post.hasUserResponded(userId)) {
//       return res.status(400).json({
//         message: 'You have already responded to this post',
//       });
//     }

//     await post.addAgree(userId);

//     res.status(200).json({
//       message: 'Successfully agreed',
//       agreeCount: post.agreeCount,
//       disagreeCount: post.disagreeCount,
//     });
//   } catch (err) {
//     console.error('Agree error:', err);
//     res.status(500).json({ message: err.message || 'Server error' });
//   }
// };

// // ----------------------
// // Disagree with a post
// // ----------------------
// const disagreeWithPost = async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const userId = req.user?._id;

//     if (!userId) return res.status(401).json({ message: 'Unauthorized' });

//     const post = await Post.findOne({ postId });
//     if (!post) return res.status(404).json({ message: 'Post not found' });

//     if (post.hasUserResponded(userId)) {
//       return res.status(400).json({
//         message: 'You have already responded to this post',
//       });
//     }

//     await post.addDisagree(userId);

//     res.status(200).json({
//       message: 'Successfully disagreed',
//       agreeCount: post.agreeCount,
//       disagreeCount: post.disagreeCount,
//     });
//   } catch (err) {
//     console.error('Disagree error:', err);
//     res.status(500).json({ message: err.message || 'Server error' });
//   }
// };

// // ----------------------
// // Get post statistics
// // ----------------------
// const getPostStats = async (req, res) => {
//   try {
//     const { postId } = req.params;

//     const stats = await Post.getPostStats(postId);
//     if (!stats) {
//       return res.status(404).json({ message: 'Post not found' });
//     }

//     res.status(200).json({ stats });
//   } catch (err) {
//     console.error('Get stats error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // ----------------------
// // Get posts by article number
// // ----------------------
// const getPostsByArticle = async (req, res) => {
//   try {
//     const { articleNumber } = req.params;

//     const posts = await Post.find({ articleNumber })
//       .populate('userId', 'userId role') // Include role
//       .sort({ createdAt: -1 })
//       .lean();

//     res.status(200).json({ posts });
//   } catch (err) {
//     console.error('Get posts by article error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // ----------------------
// // Get all posts created by a specific user (MyActivity)
// // ----------------------
// const getMyPosts = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     if (!userId) {
//       return res.status(400).json({ message: 'User ID required' });
//     }

//     // Find user document first
//     const user = await User.findOne({ userId });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const posts = await Post.find({ userId: user._id })
//       .populate('userId', 'userId role') // Include role
//       .sort({ createdAt: -1 })
//       .lean();

//     res.status(200).json({
//       posts,
//       count: posts.length,
//       userId,
//     });
//   } catch (err) {
//     console.error('Get my posts error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // ----------------------
// // Get trending posts (based on total interactions)
// // ----------------------
// const getTrendingPosts = async (req, res) => {
//   try {
//     console.log('Fetching trending posts...');
    
//     // Simple approach: calculate interaction score and sort
//     const posts = await Post.find()
//       .populate('userId', 'userId role') // Include role
//       .lean();

//     console.log(`Found ${posts.length} total posts`);

//     // Calculate interaction score for each post
//     const postsWithScores = posts.map(post => {
//       const fortyHoursAgo = new Date(Date.now() - 40 * 60 * 60 * 1000);
      
//       // Count recent interactions
//       let recentAgree = 0;
//       let recentDisagree = 0;
//       let recentPosts = 0;

//       // Count recent agrees
//       if (post.agreeList && Array.isArray(post.agreeList)) {
//         recentAgree = post.agreeList.filter(
//           item => item.timestamp && new Date(item.timestamp) >= fortyHoursAgo
//         ).length;
//       }

//       // Count recent disagrees
//       if (post.disagreeList && Array.isArray(post.disagreeList)) {
//         recentDisagree = post.disagreeList.filter(
//           item => item.timestamp && new Date(item.timestamp) >= fortyHoursAgo
//         ).length;
//       }

//       // Count recent posts/comments
//       if (post.posts && Array.isArray(post.posts)) {
//         recentPosts = post.posts.filter(
//           item => item.timestamp && new Date(item.timestamp) >= fortyHoursAgo
//         ).length;
//       }

//       const recentInteractions = recentAgree + recentDisagree + recentPosts;
//       const totalInteractions = (post.agreeCount || 0) + (post.disagreeCount || 0);

//       return {
//         ...post,
//         recentInteractions,
//         totalInteractions,
//         score: recentInteractions * 10 + totalInteractions // Weight recent activity higher
//       };
//     });

//     // Sort by score (descending) and take top 20
//     const trending = postsWithScores
//       .filter(p => p.recentInteractions > 0 || p.totalInteractions > 0)
//       .sort((a, b) => b.score - a.score)
//       .slice(0, 20);

//     console.log(`Returning ${trending.length} trending posts`);

//     res.status(200).json({ 
//       posts: trending,
//       count: trending.length 
//     });
//   } catch (err) {
//     console.error('Get trending posts error:', err);
//     console.error('Error stack:', err.stack);
//     res.status(500).json({ 
//       message: 'Server error',
//       error: err.message 
//     });
//   }
// };

// // ----------------------
// // Add a free-text post/comment to a post
// // ----------------------
// const addPostToPost = async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const { text } = req.body;
//     const userId = req.user?._id;

//     if (!userId) return res.status(401).json({ message: 'Unauthorized' });

//     const post = await Post.findOne({ postId });
//     if (!post) return res.status(404).json({ message: 'Post not found' });

//     post.posts.push({ userId, text });
//     await post.save();

//     res.status(200).json({ message: 'Post added', postId: post.postId });
//   } catch (err) {
//     console.error('Add post error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // ----------------------
// // Export all
// // ----------------------
// module.exports = {
//   createPost,
//   getAllPosts,
//   getPostById,
//   agreeWithPost,
//   disagreeWithPost,
//   getPostStats,
//   getPostsByArticle,
//   getMyPosts,
//   getTrendingPosts,
//   addPostToPost,
// };