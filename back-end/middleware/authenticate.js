// middleware/authenticate.js
const User = require('../models/userModel');

const authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    // For now, we'll extract userId from the token (in production, verify JWT)
    // The token should be the userId that was stored in localStorage
    const token = authHeader.split(' ')[1];
    
    // Find user by userId (the token is actually the userId in your case)
    const user = await User.findOne({ userId: token });
    
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized - User not found' });
    }

    // Attach user to request object
    req.user = user; // Now req.user._id is available
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};

module.exports = authenticate;