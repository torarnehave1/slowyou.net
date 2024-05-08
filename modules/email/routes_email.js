import express from 'express';
import Email from '../../models/email.js'; // Import your model

const router = express.Router();

// Create (POST)
router.post('/emails', async (req, res) => {
  const email = new Email(req.body);
  await email.save();
  res.status(201).send(email);
});

// Read all (GET)
router.get('/emails', async (req, res) => {
  const emails = await Email.find({});
  res.send(emails);
});

// Read by ID (GET)
router.get('/emails/:id', async (req, res) => {
  const email = await Email.findById(req.params.id);
  if (!email) {
    return res.status(404).send();
  }
  res.send(email);
});

// Update (PATCH)
router.patch('/emails/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['sender_name', 'sender_email', 'recipient_name', 'recipient_email', 'subject', 'body', 'attachment_url', 'send_date', 'is_read', 'is_spam', 'recipient_cc_email', 'recipient_bc_email'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  const email = await Email.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

  if (!email) {
    return res.status(404).send();
  }

  res.send(email);
});

// Delete (DELETE)
router.delete('/emails/:id', async (req, res) => {
  const email = await Email.findByIdAndDelete(req.params.id);

  if (!email) {
    return res.status(404).send();
  }

  res.send(email);
});

export default router;