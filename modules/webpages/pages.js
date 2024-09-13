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
      console.log('No token provided. Redirecting to login.');
      return res.redirect('/login.html'); // Redirect to login if no token
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    console.log('Token verification failed:', ex.message);
    return res.redirect('/login.html'); // Redirect to login if token verification fails
  }
}
// Protected route app.use('/prot', protectedRoutes);
router.get('/protected', isAuthenticated, async (req, res) => {
  try {
      const user = await User.findById(req.user.id).select('username');
      res.send(`You are authenticated as ${user.username}`);
  } catch (ex) {
      console.error(ex);
      res.status(500).send('An error occurred while processing your request.');
  }
});


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

  
  router.get('/contacts', isAuthenticated,async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('username');
        //res.send(`You are authenticated as ${user.username}`);
        res.sendFile(path.join(filePath, 'public/contacts/contacts.html'));
  
    } catch (ex) {
      console.error(ex);
        res.status(500).send('An error occurred while processing your request.');
    }
      
    
  });


  router.get('/addcontacts', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('username');
        //res.send(`You are authenticated as ${user.username}`);
        res.sendFile(path.join(filePath, 'public/contacts/add.html'));
  
    } catch (ex) {
      console.error(ex);
        res.status(500).send('An error occurred while processing your request.');
    }
      
    
  });

  router.get('/blog', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('username');
        //res.send(`You are authenticated as ${user.username}`);
        res.sendFile(path.join(filePath, 'public/blog.html'));
  
    } catch (ex) {
      console.error(ex);
        res.status(500).send('An error occurred while processing your request.');
    }
      
    
  });
  
  
  router.get('/rudder', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('username');
        //res.send(`You are authenticated as ${user.username}`);
        res.sendFile(path.join(filePath, 'modules/test/rudderstack.html'));
  
    } catch (ex) {
      console.error(ex);
        res.status(500).send('An error occurred while processing your request.');
    }
      
    
  });


  router.get('/grid', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('username');
        //res.send(`You are authenticated as ${user.username}`);
        res.sendFile(path.join(filePath, 'modules/test/grid.html'));
  
    } catch (ex) {
      console.error(ex);
        res.status(500).send('An error occurred while processing your request.');
    }
      
    
  });

  router.get('/anno', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('username');
        //res.send(`You are authenticated as ${user.username}`);
        res.sendFile(path.join(filePath, 'modules/announcements/announcements.html'));
  
    } catch (ex) {
      console.error(ex);
        res.status(500).send('An error occurred while processing your request.');
    }
      
    
  });

  router.get('/images', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('username');
        //res.send(`You are authenticated as ${user.username}`);
        res.sendFile(path.join(filePath, 'public/upload.html'));
  
    } catch (ex) {
      console.error(ex);
        res.status(500).send('An error occurred while processing your request.');
    }
      
    
  });


router.get('/users', isAuthenticated, async (req, res) => {
  try {
      const user = await User.findById(req.user.id).select('username');
      //res.send(`You are authenticated as ${user.username}`);
      res.sendFile(path.join(filePath, 'public/users/users.html'));

  } catch (ex) {
    console.error(ex);
      res.status(500).send('An error occurred while processing your request.');
  }
    
  
});

router.get('/sound', async (req, res) => {
  try {
     // const user = await User.findById(req.user.id).select('username');
      //res.send(`You are authenticated as ${user.username}`);
      res.sendFile(path.join(filePath, 'modules/soundexperience/SoundExperience.html'));

  } catch (ex) {
    console.error(ex);
      res.status(500).send('An error occurred while processing your request.');
  }
    
  
});


router.get('/dropbox', (req, res) => {
    
  res.sendFile(path.join(filePath, 'modules/dropbox/dropbox.html'));
});  


router.get('/vegvisr', (req, res) => {
    
  res.sendFile(path.join(filePath, 'modules/vegvisr/vegvisrcards.html'));
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