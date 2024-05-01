import express from 'express';
import { spawn } from 'child_process';
import { writeFile } from 'fs';
import pkg from 'body-parser';
const { json } = pkg;


const router = express.Router();
router.use(json());

router.post('/pyprocess', (req, res) => {
  // Get data from form
  const data = req.body.data;

  // Run Python script with data as parameter
  const python = spawn('python', ['public/script.py', data]);
  let pythonOutput = '';

  python.stdout.on('data', (data) => {
    pythonOutput += data.toString();
  });

  python.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).send('Error running Python script');
    }

    // Store Python script output into a file
    writeFile('output.txt', pythonOutput, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        return res.status(500).send('Error writing to file');
      }

      res.send('Data processed and stored successfully');
    });
  });
});

export default router;