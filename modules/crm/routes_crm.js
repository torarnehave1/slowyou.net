import express from 'express';
import Contact from '../../models/contacts.js'; // Import your model

const router = express.Router();

// Create (POST)
router.post('/contacts', async (req, res) => {
  const contact = new Contact(req.body);
  await contact.save();
  res.status(201).send(contact);
});

// Read all (GET)
router.get('/contacts', async (req, res) => {
    const contacts = await Contact.find({});
    res.render('view_crm_contacts', { contacts: contacts });
  });

// Read by ID (GET)
router.get('/contacts/:id', async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    return res.status(404).send();
  }
  res.send(contact);
});

// Update (PATCH)
router.patch('/contacts/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['contact_id', 'first_name', 'last_name', 'email', 'phone_number', 'address', 'city', 'country', 'postal_code', 'company_name'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

  if (!contact) {
    return res.status(404).send();
  }

  res.send(contact);
});

// Delete (DELETE)
router.delete('/contacts/:id', async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);

  if (!contact) {
    return res.status(404).send();
  }

  res.send(contact);
});

export default router;