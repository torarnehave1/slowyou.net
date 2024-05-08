import { Schema, model } from 'mongoose';

const contactSchema = new Schema({
  contact_id: Number,
  first_name: String,
  last_name: String,
  email: String,
  phone_number: String,
  address: String,
  city: String,
  country: String,
  postal_code: Number,
  company_name: String
});

const Contact = model('Contact', contactSchema, 'contacts');

export default Contact;