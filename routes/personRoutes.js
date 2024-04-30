
import express from 'express';
import Person from '../models/person.js';

const router = express.Router();

// Create - Add a new person
router.post('/api/personer', async (req, res) => {
    try {
      const newPerson = new Person(req.body);
      await newPerson.save();
      res.status(201).send(newPerson);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  });
  
  // Read - Get all persons
  router.get('/api/personer', async (req, res) => {
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
  
  // Read - Get a person by ID
  router.get('/api/personer/:id', async (req, res) => {
    try {
      const person = await Person.findById(req.params.id);
      if (!person) {
        return res.status(404).send({ message: 'Person not found' });
      }
      res.json(person);
    } catch (error) {
      console.error('Failed to fetch person:', error);
      res.status(500).send({ error: 'Error fetching person' });
    }
  });
  
  // Update - Update a person by ID
  router.put('/api/personer/:id', async (req, res) => {
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
  router.delete('/api/personer/:id', async (req, res) => {
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
  
  export default router;