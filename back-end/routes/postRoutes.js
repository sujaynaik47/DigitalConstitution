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
  getMyPosts,
  getTrendingPosts
} = require('../controllers/postController');

// Middleware to check authentication (implement based on your auth system)
const authenticate = (req, res, next) => {
  // Example: Check if user is in session/token
  // For now, assuming you have user in req.user after login
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

// Create a new post (requires authentication)
router.post('/posts', authenticate, createPost);

// Get all posts
router.get('/posts', getAllPosts);

// Get single post by postId
router.get('/posts/:postId', getPostById);

// Get posts by article number
router.get('/posts/article/:articleNumber', getPostsByArticle);

// Agree with a post (requires authentication)
router.post('/posts/:postId/agree', authenticate, agreeWithPost);

// Disagree with a post (requires authentication)
router.post('/posts/:postId/disagree', authenticate, disagreeWithPost);

// Get post statistics
router.get('/posts/:postId/stats', getPostStats);

// Get user's own posts (requires authentication)
router.get('/my-posts', authenticate, getMyPosts);

// Get trending posts
router.get('/trending-posts', getTrendingPosts);

module.exports = router;