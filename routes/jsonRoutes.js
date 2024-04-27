// routes/index.js
import express from 'express';
import { writeDocumentsToJson } from '../jsonWriter.js'; // adjust the path to match your file structure

const router = express.Router();

router.get('/write-json', async (req, res) => {
  try {
    await writeDocumentsToJson();
    res.render('jsonlink');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to write data to JSON');
  }
});



export default router;