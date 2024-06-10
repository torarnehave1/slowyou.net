import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [{
    text: {
      type: String,
      required: true
    },
    sender: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    message_from: { 
        type: String,
         required: true 
        },
  conversation_quality: { 
    type: Number, 
    required: true 
},
  mentor: {
     type: String,
      required: true 
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;