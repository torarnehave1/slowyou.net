import express from 'express';
import Person from './models/person.js';
// Import the whole package as a single default exported object
import pkg from 'body-parser';
// Destructure to get the function you need

import testRoutes from './routes/testRoutes.js';
import dbRoutes from './routes/dbRoutes.js';
import jsonRoutes from './routes/jsonRoutes.js';


import path from 'path';
import { fileURLToPath } from 'url';
import { connect, Schema, model } from 'mongoose';
import { mkdirSync, writeFile } from 'fs';
import { join } from 'path';

const app = express();
const port = 3000;
const url = 'mongodb://127.0.0.1:27017/slowyounet';
const { json } = pkg;

app.use(json()); // Middleware to parse JSON bodies



app.use('/t', testRoutes);
app.use('/db', dbRoutes);
app.use('/json', jsonRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('view engine', 'ejs'); // or 'pug', 'hbs', etc.
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'json')));



connect(url)
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




// ...

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
 // writeDocumentsToJson(); // Write documents to JSON when the server starts
});

export default app;