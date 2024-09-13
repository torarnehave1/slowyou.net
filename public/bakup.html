// middleware/auth.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET; // Ensure this is set in your .env file

export function isAuthenticated(req, res, next) {
  try {
    const token = req.cookies.jwtToken || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      const host = req.headers.host;
      return host === 'mystmkra.io' ? res.redirect('https://mystmkra.io/index.html') : res.redirect('/login.html');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach the user info to the request object
    
    next();
  } catch (ex) {
    const host = req.headers.host;
    return host === 'mystmkra.io' ? res.redirect('https://mystmkra.io/index.html') : res.redirect('/login.html');
  }
}

// New middleware function to check roles
export function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send('Access denied. You do not have permission to perform this action.');
    }
    next();
  };
}
