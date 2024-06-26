import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  FullName: {
    type: String,
    required: true
  },
  FirstName: {
    type: String,
    required: true
  },
  LastName: String,
  Notes: String,
  Photo: String,
  Label: String,
  Email: {
    type: String,
    default: ""
  },
  Phone: {
    type: String,
    required: true
  }
  ,
  Status: {
    type: String,
    enum: ["Active", "Ended", "Pause"],
    default: "Active"
  }
  
});

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;