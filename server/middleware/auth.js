const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  // Get token from header securely (Support both Bearer and exact custom formats)
  const authHeader = req.header('Authorization');
  let token;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
  } else {
      token = req.header('x-auth-token');
  }

  // Check if token does not exist universally
  if (!token) {
    return res.status(401).json({ success: false, message: 'Ninja Academy Access Denied. No token provided.' });
  }

  try {
    // Verify mathematical encryption hook
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hidden-konoha-secret');
    
    // Pass verified secure user object into the Express request flow
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Genjutsu Detected: Token is not valid.' });
  }
}

module.exports = auth;
