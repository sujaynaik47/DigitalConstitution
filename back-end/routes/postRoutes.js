 

// routes/postsRoutes.js



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
const Post = require('../models/postsModel');
const authenticate = require('../middleware/authenticate'); // Import the middleware

// ----------------------
// ROUTES
// ----------------------
// IMPORTANT: Specific routes MUST come before parameterized routes

// Create a new post
router.post('/', authenticate, createPost);

// Get all posts
router.get('/', getAllPosts);

// Get trending posts (MUST be before /:postId)
router.get('/trending', getTrendingPosts);

// Get posts by article number (MUST be before /:postId)
router.get('/article/:articleNumber', getPostsByArticle);

// Get all posts by a specific userId (MUST be before /:postId)
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
      .populate('userId', 'userId role')
      .sort({ createdAt: -1 })
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

// Get a single post by ID
router.get('/:postId', getPostById);

// Get statistics for a post (MUST be before /:postId/agree, etc.)
router.get('/:postId/stats', getPostStats);

// Agree with a post
router.post('/:postId/agree', authenticate, agreeWithPost);

// Disagree with a post
router.post('/:postId/disagree', authenticate, disagreeWithPost);

// Add a comment/post to a post
router.post('/:postId/post', authenticate, addPostToPost);

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const {
//   createPost,
//   getAllPosts,
//   getPostById,
//   agreeWithPost,
//   disagreeWithPost,
//   getPostStats,
//   getPostsByArticle,
//   addPostToPost,
//   getMyPosts,
//   getTrendingPosts
// } = require('../controllers/postController');

// const User = require('../models/userModel');
// const Post = require('../models/postsModel');

// // ----------------------
// // Middleware: Authentication
// // ----------------------
// const authenticate = (req, res, next) => {
//   // Implement your authentication logic here
//   if (!req.user) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
//   next();
// };

// // ----------------------
// // ROUTES
// // ----------------------
// // IMPORTANT: Specific routes MUST come before parameterized routes

// // Create a new post
// router.post('/', authenticate, createPost);

// // Get all posts
// router.get('/', getAllPosts);

// // Get trending posts (MUST be before /:postId)
// router.get('/trending', getTrendingPosts);

// // Get posts by article number (MUST be before /:postId)
// router.get('/article/:articleNumber', getPostsByArticle);

// // Get all posts by a specific userId (MUST be before /:postId)
// router.get('/user/:userId', async (req, res) => {
//   try {
//     const { userId } = req.params;

//     // Find the user by userId (not MongoDB _id)
//     const user = await User.findOne({ userId });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Fetch all posts created by this user
//     const posts = await Post.find({ userId: user._id })
//       .populate('userId', 'userId')
//       .sort({ createdAt: -1 })
//       .lean();

//     return res.status(200).json({
//       posts,
//       count: posts.length,
//       userId,
//     });
//   } catch (error) {
//     console.error('Error fetching user posts:', error);
//     return res.status(500).json({ message: 'Server error while fetching posts' });
//   }
// });

// // Get a single post by ID
// router.get('/:postId', getPostById);

// // Get statistics for a post (MUST be before /:postId/agree, etc.)
// router.get('/:postId/stats', getPostStats);

// // Agree with a post
// router.post('/:postId/agree', authenticate, agreeWithPost);

// // Disagree with a post
// router.post('/:postId/disagree', authenticate, disagreeWithPost);

// // Add a comment/post to a post
// router.post('/:postId/post', authenticate, addPostToPost);

// module.exports = router;