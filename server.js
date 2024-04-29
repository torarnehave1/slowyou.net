import express from 'express';
import Person from './models/person.js';
// Import the whole package as a single default exported object
import bpkg from 'body-parser';
// Destructure to get the function you need

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
//import { requiresAuth } from 'express-openid-connect';

import pkg from 'express-openid-connect';
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
  baseURL: 'http://localhost:3000',
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('view engine', 'ejs'); // or 'pug', 'hbs', etc.
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'json')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/signin', express.static(path.join(__dirname, 'signin')));
app.use('/logo', express.static(path.join(__dirname, 'logo')));

app.get('/support', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'support.html'));
});

connect(MONGO_DB_URL)
  .then(() => console.log('Connected to MongoDB with Mongoose'))
  .catch(err => console.error('Could not connect to MongoDB', err));


  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

app.get('/api/personer/:id', async (req, res) => {
  try {
      const person = await Person.findById(req.params.id);
      if (!person) {
          return res.status(404).send({ message: "Person not found" });
      }
      res.json(person);
  } catch (error) {
      console.error('Failed to fetch person:', error);
      res.status(500).send({ error: 'Error fetching person' });
  }
});





// Create - Add a new person
app.post('/api/personer', async (req, res) => {
  try {
    const newPerson = new Person(req.body);
    await newPerson.save();
    res.status(201).send(newPerson);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Read - Get all persons
app.get('/api/personer', async (req, res) => {
  try {
    const personList = await Person.find();
    const personListWithId = personList.map(person => ({
      id: person._id,
      name: person.name,
      phone: person.phone,
      email: person.email,
      
      // include any other fields you want to return
    }));
    res.json(personListWithId);
  } catch (error) {
    console.error('Failed to fetch personer:', error);
    res.status(500).send('Error fetching personer');
  }
});


// Update - Update a person by ID
app.put('/api/personer/:id', async (req, res) => {
  try {
      const person = await Person.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!person) {
          return res.status(404).send({ message: 'Person not found' });
      }
      res.send(person);
  } catch (error) {
      console.error('Server error:', error);
      res.status(500).send({ error: 'Server error' });
  }
});

// Delete - Delete a person by ID
app.delete('/api/personer/:id', async (req, res) => {
  try {
    const deletedPerson = await Person.findByIdAndDelete(req.params.id);
    if (!deletedPerson) {
      return res.status(404).send({ error: 'Person not found' });
    }
    res.send(deletedPerson);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

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



app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});


// ...

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
 // writeDocumentsToJson(); // Write documents to JSON when the server starts
});

export default app;