import express from 'express';
import User from '../models/User.js'; // Import the User model
import Conversation from '../models/Conversation.js'; // Import the Conversation model

const router = express.Router();

// GET all conversations
router.get('/', async (req, res) => {
  try {
    const conversations = await Conversation.find();
    res.json(conversations);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving conversations');
  }
});

// GET a conversation by ID
router.get('/:id', async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).send('Conversation not found');
    }
    res.json(conversation);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving conversation');
  }
});

// POST a new conversation with a user
router.post('/', async (req, res) => {
  try {
    const { userId, message } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Create a new conversation
    const conversation = await Conversation.create({
      userId,
      messages: [{ text: message, sender: 'user' }]
    });

    res.status(201).json(conversation);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating conversation');
  }
});

export default router;