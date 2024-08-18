// middleware/auth.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET; // Ensure this is set in your .env file

export function isAuthenticated(req, res, next) {
  try {
    // Check for token in cookies or Authorization header
    const token = req.cookies.jwtToken || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      console.log('No token provided. Redirecting to login.');
      return res.redirect('/login.html'); // Redirect to login if no token
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach the decoded token (user info) to the request object
    req.user = decoded;
    
    // Proceed to the next middleware or route handler
    next();
  } catch (ex) {
    console.log('Token verification failed:', ex.message);
    // Optionally, you could add more detailed logging here
    return res.redirect('/login.html'); // Redirect to login if token verification fails
  }
}
