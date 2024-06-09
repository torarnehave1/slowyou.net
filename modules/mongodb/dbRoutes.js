// routes/dbRoutes.js
import express from 'express';
import mongoose from 'mongoose';
import Person from '../../models/person.js';
import User from '../../models/User.js'; // Import the User model
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const token = crypto.randomBytes(20).toString('hex');
const hashedPassword = await bcrypt.hash('Mandala1.', 10);

const router = express.Router();

router.get('/test', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const message = dbState === 1 ? 'Database connection successful' : 'Database connection failed';
  res.render('test', { message });
});



router.get('/constring', (req, res) => {
  const dbState = mongoose.connection.readyState;
  let message = dbState === 1 ? 'Database connection successful' : 'Database connection failed';
  
  // Get the connection URI
  const connectionUri = mongoose.connection.client.s.url;
  
  // Grab the first 20 characters of the connection URI
  const truncatedUri = connectionUri.substring(0, 20);

  // Concatenate the message with the truncated connection string
  message += ` - Connected to: ${truncatedUri}`;

  res.render('test', { message });
});

const mockUser = {
  fullName: 'John Doe',
  username: 'john@example.com',
  password: hashedPassword,
  emailVerificationToken: token,
};

router.get('/mockup', async (req, res) => {
  try {
    // Create a new user document using the mockup user object
    const newUser = new User(mockUser);
    // Save the user to the database
    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding mockup user to the database');
  }
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