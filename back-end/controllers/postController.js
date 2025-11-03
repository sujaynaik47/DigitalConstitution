const Post = require('../models/postsModel');

// Create a new post
const createPost = async (req, res) => {
  try {
    const { articleNumber, articleTitle, content } = req.body;
    const userId = req.user._id; // Assuming user is authenticated

    if (!articleNumber || !articleTitle || !content) {
      return res.status(400).json({ 
        message: 'Article number, title, and content are required' 
      });
    }

    const newPost = await Post.create({
      userId,
      articleNumber,
      articleTitle,
      content
    });

    res.status(201).json({
      message: 'Post created successfully',
      post: newPost
    });
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .select('userId postId articleNumber articleTitle content agreeCount disagreeCount')
      .sort({ createdAt: -1 });

    res.status(200).json({ posts });
  } catch (err) {
    console.error('Get posts error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single post by postId
const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findOne({ postId });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ post });
  } catch (err) {
    console.error('Get post error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Agree with a post
const agreeWithPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findOne({ postId });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user already responded
    if (post.hasUserResponded(userId)) {
      return res.status(400).json({ 
        message: 'You have already responded to this post' 
      });
    }

    await post.addAgree(userId);

    res.status(200).json({
      message: 'Successfully agreed',
      agreeCount: post.agreeCount,
      disagreeCount: post.disagreeCount
    });
  } catch (err) {
    console.error('Agree error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// Disagree with a post
const disagreeWithPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findOne({ postId });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user already responded
    if (post.hasUserResponded(userId)) {
      return res.status(400).json({ 
        message: 'You have already responded to this post' 
      });
    }

    await post.addDisagree(userId);

    res.status(200).json({
      message: 'Successfully disagreed',
      agreeCount: post.agreeCount,
      disagreeCount: post.disagreeCount
    });
  } catch (err) {
    console.error('Disagree error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// Get post statistics
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

// Get posts by article number
const getPostsByArticle = async (req, res) => {
  try {
    const { articleNumber } = req.params;

    const posts = await Post.find({ articleNumber })
      .sort({ createdAt: -1 });

    res.status(200).json({ posts });
  } catch (err) {
    console.error('Get posts by article error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's own posts
const getMyPosts = async (req, res) => {
  try {
    const userId = req.user._id; // Get authenticated user's ID

    const posts = await Post.find({ userId })
      .select('userId postId articleNumber articleTitle content agreeCount disagreeCount')
      .sort({ createdAt: -1 });
    res.status(200).json({ posts });
  } catch (err) {
    console.error('Get my posts error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get trending posts
const getTrendingPosts = async (req, res) => {
  try {
    const trendingPosts = await Post.getTrendingPosts();
    res.status(200).json({ posts: trendingPosts });
  } catch (err) {
    console.error('Get trending posts error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  agreeWithPost,
  disagreeWithPost,
  getPostStats,
  getPostsByArticle,
  getMyPosts,
  getTrendingPosts
};