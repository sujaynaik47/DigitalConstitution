// controllers/postController.js

const Post = require('../models/postsModel');
const User = require('../models/userModel');

// ----------------------
// Create a new post
// ----------------------
const createPost = async (req, res) => {
  try {
    const { articleNumber, articleTitle, content } = req.body;
    const userId = req.user?._id; // assuming user is authenticated

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!articleNumber || !articleTitle || !content) {
      return res.status(400).json({
        message: 'Article number, title, and content are required',
      });
    }

    const newPost = await Post.create({
      userId,
      articleNumber,
      articleTitle,
      content,
    });

    res.status(201).json({
      message: 'Post created successfully',
      post: newPost,
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
      .populate('userId', 'userId') // populate readable userId
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
      .populate('userId', 'userId')
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
// Get posts by article number
// ----------------------
const getPostsByArticle = async (req, res) => {
  try {
    const { articleNumber } = req.params;

    const posts = await Post.find({ articleNumber })
      .populate('userId', 'userId')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ posts });
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
    const { userId } = req.params; // comes from /user/:userId route

    if (!userId) {
      return res.status(400).json({ message: 'User ID required' });
    }

    // Find user document first (since your User model stores userId as string)
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const posts = await Post.find({ userId: user._id })
      .populate('userId', 'userId')
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
// Get trending posts
// ----------------------
const getTrendingPosts = async (req, res) => {
  try {
    // Example logic: sort by (agreeCount - disagreeCount)
    const trendingPosts = await Post.find()
      .sort({ agreeCount: -1, disagreeCount: 1 })
      .limit(10)
      .populate('userId', 'userId')
      .lean();

    res.status(200).json({ posts: trendingPosts });
  } catch (err) {
    console.error('Get trending posts error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ----------------------
// Add a free-text opinion/comment to a post
// ----------------------
const addOpinionToPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const post = await Post.findOne({ postId });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.opinions.push({ userId, text });
    await post.save();

    res.status(200).json({ message: 'Opinion added', postId: post.postId });
  } catch (err) {
    console.error('Add opinion error:', err);
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
  addOpinionToPost,
};
