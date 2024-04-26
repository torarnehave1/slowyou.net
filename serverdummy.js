import express from 'express';

// Import the whole package as a single default exported object
import pkg from 'body-parser';
// Destructure to get the function you need

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
app.use(express.static('public'));


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connect(url)
  .then(() => console.log('Connected to MongoDB with Mongoose'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Add the provided code snippet here
const personSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  givenname: {
    type: String,
    required: true
  },
  familyname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  organization: {
    type: String,
    required: true
  }
});
const Person = model('Person', personSchema, 'personer'); // Explicitly specifying the collection name

// Your route definitions follow here

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


async function writeDocumentsToJson() {
  try {
    const personList = await Person.find();
    const dirPath = join(__dirname, 'json');
    mkdirSync(dirPath, { recursive: true }); // Create the directory if it doesn't exist
    const filePath = join(dirPath, 'personer.json');
    writeFile(filePath, JSON.stringify(personList, null, 2), function(err) {
      if (err) throw err;
      console.log('Data successfully written to ' + filePath);
    });
  } catch (error) {
    console.error('Failed to write documents to JSON:', error);
  }
}


// ...

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  writeDocumentsToJson(); // Write documents to JSON when the server starts
});