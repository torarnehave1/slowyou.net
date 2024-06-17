import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import User from '../../models/User.js';




const app = express();
app.use(cookieParser());

dotenv.config();


//Root for this endpoint are /w/endpointname app.use('/w', webpagesroutes);

const JWT_SECRET = process.env.JWT_SECRET;


const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.resolve(__dirname, '..', '..');

function isAuthenticated(req, res, next) {
  try {
      const token = req.cookies.jwtToken;
      if (!token) {
          return res.redirect('/login');
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
  } catch (ex) {
    return res.redirect('/login');
  }
}


router.get('/test', (req, res) => {
 
  console.log(filePath);
  
    res.render('test', { message: 'This is a test message from the WPages END POINT' });
  });

router.get('/faq', (req, res) => {
    const faqs = [
      { question: 'Spørsmål1', answer: 'Answer 1' },
      { question: 'Question 2', answer: 'Answer 2' },
      { question: 'Question 3', answer: 'Answer 3' },
      { question: 'Question 4', answer: 'Answer 4' },
    ];
    res.render('view_faq', { faqs: faqs });
  });

  router.get('/protected', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('username');
        //res.send(`You are authenticated as ${user.username}`);
        res.sendFile(path.join(filePath, 'public/users/user_search.html'));

    } catch (ex) {
        console.error(ex);
        res.status(500).send('An error occurred while processing your request.');
    }
});

router.get('/users', isAuthenticated, async (req, res) => {
  try {
      const user = await User.findById(req.user.id).select('username');
      //res.send(`You are authenticated as ${user.username}`);
      res.sendFile(path.join(filePath, 'public/users/user_search.html'));

  } catch (ex) {
    
  }
});

  
  router.get('/coma', (req, res) => {
    
    res.sendFile(path.join(filePath, 'public/challenges/coma10day.html'));
  });
 
 
  router.get('/bodymind', (req, res) => {
    
    res.sendFile(path.join(filePath, 'public/landpages/waitinglist.html'));
  });
  router.get('/slow', (req, res) => {
    
    res.sendFile(path.join(filePath, 'public/landpages/slowyoutrening.html'));
  });

  router.get('/slowgpt', (req, res) => {
    
    res.sendFile(path.join(filePath, 'public/courses/slowyougpt.html'));
  });
  
  export default router;