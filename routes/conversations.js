import express from 'express';
import User from '../models/User.js'; // Import the User model
import Conversation from '../models/conversation.js'; // Import the Conversation model

const router = express.Router();

// GET all conversations
//app.use('/n',conversations_route);

router.get('/gris', async (req, res) => {

  res.send('Hello, world!');
});

// Route to save a conversation note
router.post('/addnote', async (req, res) => {
  try {
    const { contactName, contactId, note, quality, date } = req.body;
    const conversation = new Conversation({
      Name: contactName,
      note: [{userId: contactId, text: note, conversation_quality: quality, mentor: 'TAH' ,timestamp: date}],
      

    });
    const savedConversation = await conversation.save();
    res.status(201).json(savedConversation);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving conversation');
  }
});


// Route to search for a conversation note by userId
router.get('/findnotes/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const notes = await Conversation.find({ 'note.0.userId': userId });
    res.status(200).json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error finding conversation');
  }
});

//What does the server.js say about the conversations routes what is the root
//app.use('/conversations', conversationsRoutes);
//The root for this endpoint is /conversations


// The root for this endpoint is '/n'



export default router;