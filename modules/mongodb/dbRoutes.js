// routes/dbRoutes.js
import express from 'express';
import mongoose from 'mongoose';
import Person from '../../models/person.js';




const router = express.Router();

router.get('/test', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const message = dbState === 1 ? 'Database connection successful' : 'Database connection failed';
  res.render('test', { message });
});

router.get('/constring', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const message = dbState === 1 ? 'Database connection successful' : 'Database connection failed';
  
  // Get the connection URI
  const connectionUri = mongoose.connection.client.s.url;
  
  // Grab the first 20 characters of the connection URI
  const truncatedUri = connectionUri.substring(0, 20);

  res.render('test', { message, truncatedUri });
});


// Read - Get all persons
router.get('/personer', async (req, res) => {
  try {
    const personList = await Person.find();
    const personListWithId = personList.map(person => ({
      id: person._id,
      name: person.name,
      phone: person.phone,
      email: person.email,
    }));
    res.json(personListWithId);
  } catch (error) {
    console.error('Failed to fetch persons:', error);
    res.status(500).send({ error: 'Error fetching persons' });
  }
});

export default router;