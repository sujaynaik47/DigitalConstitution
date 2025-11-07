// routes/postsRoutes.js

const express = require('express');
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  agreeWithPost,
  disagreeWithPost,
  getPostStats,
  getPostsByArticle,
  addPostToPost,
  getMyPosts,
  getTrendingPosts
} = require('../controllers/postController');

const User = require('../models/userModel');
const Post = require('../models/postsModel'); // renamed from Opinion to Post for clarity

// ----------------------
// Middleware: Authentication
// ----------------------
const authenticate = (req, res, next) => {
  // Implement your authentication logic here
  // For example, if you're using sessions or JWTs:
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

// ----------------------
// ROUTES
// ----------------------

// Create a new post
router.post('/', authenticate, createPost);

// Get all posts
router.get('/', getAllPosts);

// Get a single post by ID
router.get('/:postId', getPostById);

// Get posts by article number
router.get('/article/:articleNumber', getPostsByArticle);

// Agree with a post
router.post('/:postId/agree', authenticate, agreeWithPost);

// Disagree with a post
router.post('/:postId/disagree', authenticate, disagreeWithPost);

// Add a comment/post to a post
router.post('/:postId/post', authenticate, addPostToPost);

// Get statistics for a post
router.get('/:postId/stats', getPostStats);

// Get all posts by a specific userId (for MyActivity)
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by userId (not MongoDB _id)
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch all posts created by this user
    const posts = await Post.find({ userId: user._id })
      .sort({ createdAt: -1 }) // newest first
      .lean();

    return res.status(200).json({
      posts,
      count: posts.length,
      userId,
    });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return res.status(500).json({ message: 'Server error while fetching posts' });
  }
});

// Get trending posts
router.get('/trending', getTrendingPosts);

module.exports = router;
