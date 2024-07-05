// routes/index.js
import express from 'express';
//import { writeDocumentsToJson } from '../jsonWriter.js'; // adjust the path to match your file structure
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';



dotenv.config();

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const JWT_SECRET = process.env.JWT_SECRET;

function isAuthenticated(req, res, next) {
  try {
    const token = req.cookies.jwtToken;
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided. Please log in.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    return res.status(401).json({ status: 'error', message: 'Token verification failed. Please log in.' });
  }
}





router.get('/write-json',isAuthenticated, async (req, res) => {
  try {
    await writeDocumentsToJson();
    res.render('jsonlink');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to write data to JSON');
  }
});



// Import the necessary modules


// Create an instance of the express router
//app.use('/json', jsonRoutes);

// Define the route to add a quote
router.post('/addquote',isAuthenticated, (req, res) => {
  // Get the quote and author from the request body
  const { quote, author ,timeperiode} = req.body;
console.log(req.body);


fs.readFile(path.join(__dirname, '../public/quotes/quotes.json'), 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    res.status(500).send('Failed to read quotes file');
  } else {
    // Parse the existing quotes
    const quotes = JSON.parse(data);

    // Add the new quote to the quotes array
    quotes.quotes.push({ Quote: quote, Author: author, TimePeriod: timeperiode });

    // Write the updated quotes back to the file
    fs.writeFile(path.join(__dirname, '../public/quotes/quotes.json'), JSON.stringify(quotes, null, 2), 'utf8', (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Failed to write quotes file');
      } else {
        res.send('Quote added successfully');
      }
    });
  }
});
  // Read the existing quotes from the file
  
});




export default router;