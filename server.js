import express from 'express';
import bpkg from 'body-parser';
import testRoutes from './routes/testRoutes.js';
import dbRoutes from './routes/dbRoutes.js';
import jsonRoutes from './routes/jsonRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { connect, Schema, model } from 'mongoose';
import { mkdirSync, writeFile } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';
import { auth } from 'express-openid-connect';
import personRoutes from './routes/personRoutes.js';
import pkg from 'express-openid-connect';
import { Octokit } from "@octokit/core";
import githubRoutes from './routes/githubRoutes.js';
import serveIndex from 'serve-index';
import pyprocess from './routes/pyprocess.js';

const { requiresAuth } = pkg;


dotenv.config();


const API_ENDPOINT = process.env.API_ENDPOINT;
const API_PROJECT_ID = process.env.API_PROJECT_ID;
const API_DATABASE_KEY = process.env.API_DATABASE_KEY;
const API_COLLECTION_KEY = process.env.API_COLLECTION_KEY;
const API_FUNCTION_ID = process.env.API_FUNCTION_ID;
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const PORT = process.env.PORT;
const DUMMY_DB_HOST = process.env.DUMMY_DB_HOST;
const DUMMY_ENV = process.env.DUMMY_ENV;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USER = process.env.GITHUB_USER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH;
const GITHUB_PATH = process.env.GITHUB_PATH;
const MONGO_DB_URL = process.env.MONGO_DB_URL;
const LOGIN_SECRET = process.env.LOGIN_SECRET;

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: LOGIN_SECRET,
  baseURL: 'https://slowyou.net',
  clientID: '40Whs58sxGo70SRCLYMiPStTreE3yoMV',
  issuerBaseURL: 'https://dev-l5gohk1fiankh7si.eu.auth0.com'
};




const app = express();
const port = 3000;
const { json } = bpkg;

app.use(json()); // Middleware to parse JSON bodies
app.use(auth(config));




app.use('/t', testRoutes);
app.use('/db', dbRoutes);
app.use('/json', jsonRoutes);
app.use('/api/personer', personRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/py", pyprocess);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('view engine', 'ejs'); // or 'pug', 'hbs', etc.
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/static', express.static(path.join(__dirname, 'json')), serveIndex(path.join(__dirname, 'json'), {'icons': false}));
app.use('/assets', express.static(path.join(__dirname, 'assets')), serveIndex(path.join(__dirname, 'assets'), {'icons': false}));
app.use('/signin', express.static(path.join(__dirname, 'signin')), serveIndex(path.join(__dirname, 'signin'), {'icons': false}));
app.use('/logo', express.static(path.join(__dirname, 'logo')), serveIndex(path.join(__dirname, 'logo'), {'icons': false}));
app.use('/images', express.static(path.join(__dirname, 'images')), serveIndex(path.join(__dirname, 'images'), {'icons': false}));
app.use('/error', express.static(path.join(__dirname, 'error')), serveIndex(path.join(__dirname, 'error'), {'icons': false}));

app.get('/support', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'support.html'));
});

connect(MONGO_DB_URL)
  .then(() => console.log('Connected to MongoDB with Mongoose'))
  .catch(err => console.error('Could not connect to MongoDB', err));


  

app.use((err, req, res, next) => {
  if (err) {
    console.error(err);
    res.status(500).render('error', { message: 'An error occurred during authentication.' });
  } else {
    next();
  }
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
  //res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});



//app.get('/login-status', (req, res) => {
  //res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
//});


// ...

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
 // writeDocumentsToJson(); // Write documents to JSON when the server starts
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


import https from 'https';


// Your existing server setup code...

// After your server has started, make a GET request to the route
https.get('https://slowyou.net/t/run-script/X2uV1V1M_3g', (res) => {
  let data = '';

  // A chunk of data has been received.
  res.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received.
  res.on('end', () => {
    console.log(data);
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});




export default app;