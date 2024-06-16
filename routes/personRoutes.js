
import express from 'express';
import Person from '../models/person.js';
import Contact from '../models/contact.js';


const router = express.Router();

// Create - Add a new person
router.post('/api/personer/addnew', async (req, res) => {
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


  // Read - Get a person by name
  router.get('/api/personer/name/:name', async (req, res) => {
    try {
      const person = await Person.find({ $or: [ { name: { $regex: `.*${req.params.name}.*`, $options: 'i' } }, { name: { $regex: `^${req.params.name}`, $options: 'i' } } ] });
      if (!person) {
        return res.status(404).send({ message: 'Person not found' });
      }
      res.json(person);
    } catch (error) {
      console.error('Failed to fetch person:', error);
      res.status(500).send({ error: 'Error fetching person' });
    }
  });

  // Read - Get all contacts
  router.get('/api/contacts', async (req, res) => {
    try {
      const contacts = await Contact.find();
      res.json(contacts);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      res.status(500).send({ error: 'Error fetching contacts' });
    }
  });



  // Read - Get a specific contact by id
  router.get('/api/contacts/search/:name', async (req, res) => {
    try {
      const contacts = await Contact.find({
        $or: [
          { FullName: { $regex: `^${req.params.name}`, $options: 'i' } },
          { Email: { $regex: `^${req.params.name}`, $options: 'i' } }
        ]
      });
      if (!contacts) {
        return res.status(404).send({ message: 'Contact not found' });
      }
      res.json(contacts);
    } catch (error) {
      console.error('Failed to fetch contact:', error);
      res.status(500).send({ error: 'Error fetching contact' });
    }
  });

  router.get('/api/contacts/addlabel/:name/:labelname', async (req, res) => {
    try {
      const contacts = await Contact.find({ FirstName: req.params.name });
  
      if (!contacts) {
        console.log('Contact not found');
        return res.status(404).send({ message: 'Contact not found' });
      }
  
      contacts.forEach(async contact => {
        console.log('Processing contact', contact.FullName);
        contact.Label = req.params.labelname;
        contact.save();
      });
  
      console.log('Contacts with name updated with label');
      res.json({ message: `Contacts with name ${req.params.name} updated with label ${req.params.labelname}` });
    } catch (error) {
      console.error('Failed to fetch contact:', error);
      res.status(500).send({ error: 'Error fetching contact' });
    }
  });
  
  router.get('/api/contacts/addphone/:name', async (req, res) => {

    try {
      const contacts = await Contact.find({
        $or: [
          { FullName: { $regex: `^${req.params.name}`, $options: 'i' } },
          { Email: { $regex: `^${req.params.name}`, $options: 'i' } }
        ]
      });
      if (!contacts) {
        return res.status(404).send({ message: 'Contact not found' });
      }
      contacts.forEach(contact => {
        contact.Phone = "+4793453813";
        contact.save();
      })
      res.json(contacts);
    } catch (error) {
      console.error('Failed to fetch contact:', error);
      res.status(500).send({ error: 'Error fetching contact' });
    }
  });




  // Read - Get a person by email
  router.get('/api/personer/email/:email', async (req, res) => {
    try {
      const person = await Person.findOne({ email: req.params.email });
      if (!person) {
        return res.status(404).send({ message: 'Person not found' });
      }
      res.json(person);
    } catch (error) {
      console.error('Failed to fetch person:', error);
      res.status(500).send({ error: 'Error fetching person' });
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