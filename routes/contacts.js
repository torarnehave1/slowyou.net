// Importer nødvendige moduler
import { Router } from 'express';
const router = Router();
import Contact from '../models/contact.js';
import mongoose from 'mongoose';
//
//app.use('/c/',contacts_route);

// Definer ruten for å søke etter kontakter
router.get('/api/contacts/search/:name', async (req, res) => {
  try {
    


    const contacts = await Contact.find({
      $or: [
        { FullName: { $regex: `^${req.params.name}`, $options: 'i' } },
        { Email: { $regex: `^${req.params.name}`, $options: 'i' } },
        { Status: { $regex: `^${req.params.name}`, $options: 'i' } }
      ]
    }).select('FullName FirstName LastName Email Phone Label Status StartDate EndDate');

    if (!contacts) {
      return res.status(404).send({ message: 'Contact not found' });
    }
    console.log(contacts); // Add this line
    res.json(contacts);
  } catch (error) {
    console.error('Failed to fetch contact:', error);
    res.status(500).send({ error: 'Error fetching contact' });
  }
});


// Define route to update Contact Status by ID
router.put('/status/:id', async (req, res) => {
    console.log(req.params.id);
    console.log(req.body.status);

    try {
      const contact = await Contact.findById(req.params.id);
      if (!contact) {
        return res.status(404).send({ message: 'Contact not found' });
      }
      if (req.body.status) {
        contact.Status = req.body.status;
      }
      if (req.body.Phone) {
        contact.Phone = req.body.Phone;
      }
      await contact.save();
      res.send(contact.Status);

    } catch (error) {
      console.error('Failed to update contact status:', error);
      res.status(500).send({ error: 'Error updating contact status' });
    }
});

router.delete('/contacts/:id', async (req, res) => {
  console.log(req.params.id);
  try {
    const ContactID = req.params.id;
    const contact = await Contact.findById(ContactID);
   
    if (!contact) {
        return res.status(404).json({ message: 'Contact not found.' });
    }
    await Contact.deleteOne({ _id: ContactID });
    res.status(200).json({ message: 'Contact deleted successfully.' });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while deleting the Contact.' });
}
});


// Define route to add new contact


router.post('/contacts', async (req, res) => {
  try {
    const newContact = new Contact({
      _id: new mongoose.Types.ObjectId(), // Manually generate an _id
      FullName: req.body.FullName,
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      Notes: req.body.Notes,
      Photo: req.body.Photo,
      Label: req.body.Label,
      Email: req.body.Email,
      Phone: req.body.Phone
    });
    const savedContact = await newContact.save();
    res.send(savedContact);
  } catch (error) {
    console.error('Failed to save contact:', error);
    res.status(500).send({ error: 'Error saving contact' });
  }
});


export default router;

