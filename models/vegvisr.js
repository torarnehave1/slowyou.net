import { Schema, model } from 'mongoose';

// Define the schema
const vegvisrSchema = new Schema({
  _id: {
    $oid: Schema.Types.ObjectId
  },
  Date: {
    type: String,
    required: true
  },
  Name: {
    type: String,
    required: true
  },
  Year: {
    type: Number,
    required: true
  }
});

// Create the model
const Vegvisr = model('vegvisr', vegvisrSchema);

export default Vegvisr;