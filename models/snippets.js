import mongoose from 'mongoose';

const SnippetSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    
    snippetname:{
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },

  User_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

});

const Snippet = mongoose.model('Snippets', SnippetSchema);
export default Snippet;