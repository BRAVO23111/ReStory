import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

// Middleware to verify JWT token
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if token exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Extract token from the header
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Attach user to the request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Error in authMiddleware:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export { authMiddleware };
