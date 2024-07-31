import express from 'express';
import bodyParser from 'body-parser';
import dbRoutes from './modules/mongodb/dbRoutes.js';
import jsonRoutes from './routes/jsonRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { connect } from 'mongoose';
import dotenv from 'dotenv';
//import { auth } from 'express-openid-connect';
import personRoutes from './routes/personRoutes.js';
import githubRoutes from './modules/github/route_github.js';
//import pyprocess from './routes/pyprocess.js';
import youtubeRoutes from "./modules/youtube/route_youtube.js";
import emailRoutes from "./modules/email/routes_email.js";
//import crmRoutes from "./modules/crm/routes_crm.js";
import webpagesRoutes from "./modules/webpages/pages.js";
//import groq from './modules/api/groq.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user_routes.js'; // Import the user routes
import protectedRoutes from './routes/protected.js';
import contacts_route from './routes/contacts.js';
import conversations_route from './routes/conversations.js';
import products_route from './routes/products_route.js';
import vegvisr_route from './modules/vegvisr/vegvisr_route.js';
import rateLimit from 'express-rate-limit'; //Security to protect from brute force
import morgan from 'morgan'; //Log funcionality
import imgroutes from './routes/images.js';
import dropboxfilesroutes from './routes/dropbox.js';
import mdroute from './routes/markdown_route.js';
import blogpost from './routes/blogpost_routes.js';
import Mdfiles from './routes/Mdfiles_to_db_routes.js';


//import security from './modules/security/routes_security.js';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000 // limit each IP to 100 requests per windowMs
});





dotenv.config(); // Load environment variables

const app = express();
app.use(limiter);




const port = process.env.PORT || 3000;

const logger = morgan('combined');
app.use(logger);

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.LOGIN_SECRET,
  baseURL: `http://localhost:${port}`,
  clientID: process.env.GITHUB_CLIENTID,
  issuerBaseURL: 'https://dev-l5gohk1fiankh7si.eu.auth0.com'
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // Adjust the limit as needed



app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // or 'pug', 'hbs', etc.
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'json')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/signin', express.static(path.join(__dirname, 'signin')));
app.use('/logo', express.static(path.join(__dirname, 'logo')));
//app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/error', express.static(path.join(__dirname, 'error')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



// Routes
//app.use('/t', testRoutes);
app.use('/db', dbRoutes);
app.use('/json', jsonRoutes);
app.use('/p', personRoutes);
app.use("/api/github", githubRoutes);
//app.use("/api/py", pyprocess);
app.use('/youtube', youtubeRoutes);
app.use('/e', emailRoutes);
//app.use('/crm', crmRoutes);
app.use('/w', webpagesRoutes);
//app.use('/g', groq);
app.use('/a', userRoutes);
app.use('/prot', protectedRoutes);
app.use('/c/',contacts_route);
app.use('/n',conversations_route);
app.use('/products',products_route);
app.use('/vegvisr', vegvisr_route);
app.use('/img', imgroutes);
app.use('/dropbox', dropboxfilesroutes);
app.use('/md', mdroute);
app.use('/blog', blogpost);
app.use('/mdfiles', Mdfiles);

app.get('/support', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'support.html'));
});

const s = process.env.MONGO_DB_URL

console.log(s)

connect(process.env.MONGO_DB_URL)

  .then(() => console.log('Connected to MongoDB with Mongoose'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Error handling middleware
app.use((err, req, res, next) => {
  if (err) {
    console.error(err);
    res.status(500).render('error', { message: 'An error occurred during authentication.' });
  } else {
    next();
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;
