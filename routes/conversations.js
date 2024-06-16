import express from 'express';
import User from '../models/User.js'; // Import the User model
import Conversation from '../models/conversation.js'; // Import the Conversation model

const router = express.Router();

// GET all conversations


router.get('/gris', async (req, res) => {

  res.send('Hello, world!');
});

// Route to save a conversation note
router.post('/addnote', async (req, res) => {
  try {
    const { contactName, contactId, note, quality, date } = req.body;
    const conversation = new Conversation({
      Name: contactName,
      note: [{userId: contactId, text: note, conversation_quality: quality, mentor: 'TAH' }],
      date
    });
    const savedConversation = await conversation.save();
    res.status(201).json(savedConversation);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving conversation');
  }
});

export default router;