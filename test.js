// jsonWriter.js
import { join } from 'path';
import { mkdirSync, writeFile } from 'fs';
import Person from './models/person.js'; // adjust the path to match your file structure
import { connect, Schema, model } from 'mongoose';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const url = 'mongodb://127.0.0.1:27017/slowyounet';

connect(url)
  .then(() => console.log('Connected to MongoDB with Mongoose'))
  .catch(err => console.error('Could not connect to MongoDB', err));


export async function writeDocumentsToJson() {
  try {
    const personList = await Person.find();
    const dirPath = join(__dirname, 'json');
    mkdirSync(dirPath, { recursive: true }); // Create the directory if it doesn't exist
    const filePath = join(dirPath, 'personer.json');
    writeFile(filePath, JSON.stringify(personList, null, 2), function(err) {
      if (err) throw err;
      console.log('Data successfully written to ' + filePath);
    });
  } catch (error) {
    console.error('Failed to write documents to JSON:', error);
  }
}

// Call the function directly to test it
writeDocumentsToJson().catch(console.error);