// routes/testRoutes.js




import express from 'express';
import { join } from 'path';
import { mkdirSync, writeFile } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const router = express.Router();

router.get('/message', (req, res) => {
  res.render('test', { message: 'This is a test message' });
});


  router.get('/write', (req, res) => {
    const dirPath = join(__dirname, 'json');
    mkdirSync(dirPath, { recursive: true }); // Create the directory if it doesn't exist
    const filePath = join(dirPath, 'test.json');
    const data = { message: 'Hello World' };
  
    writeFile(filePath, JSON.stringify(data, null, 2), function(err) {
      if (err) {
        console.error('Failed to write to file:', err);
        return res.status(500).send('Error writing to file');
      }
  
      console.log('Data successfully written to ' + filePath);
      res.send('Data written to file successfully');
    });
  });



  import { appendFile } from 'fs';

router.get('/append', (req, res) => {
  const dirPath = join(__dirname, 'json');
  mkdirSync(dirPath, { recursive: true }); // Create the directory if it doesn't exist
  const filePath = join(dirPath, 'test.json');
  const data = { message: 'Hello World' };

  appendFile(filePath, JSON.stringify(data, null, 2) + ',\n', function(err) {
    if (err) {
      console.error('Failed to write to file:', err);
      return res.status(500).send('Error writing to file');
    }

    console.log('Data successfully appended to ' + filePath);
    res.send('Data appended to file successfully');
  });
});

router.get('/append-md', (req, res) => {
  const dirPath = join(__dirname, '..', 'public', 'markdown');
  mkdirSync(dirPath, { recursive: true }); // Create the directory if it doesn't exist
  const filePath = join(dirPath, 'test.md');
  const data = '## Hello World\n';

  appendFile(filePath, data, function(err) {
    if (err) {
      console.error('Failed to write to file:', err);
      return res.status(500).send('Error writing to file');
    }

    console.log('Data successfully appended to ' + filePath);
    res.send('Data appended to file successfully');
  });
});



router.get('/extract-id/:url', (req, res, next) => {
  console.log(req.params); // log the request parameters
  next(); // pass control to the next handler
}, (req, res) => {
  const { url } = req.params;

  if (!url) {
    return res.status(400).send('No URL provided');
  }

  const videoId = url.split('/').pop().split('?')[0];

  if (!videoId) {
    return res.status(400).send('No video ID found in URL');
  }

  res.send(`Video ID: ${videoId}`);
  console.log(`Video ID: ${videoId}`);
});

import { spawn } from 'child_process';




router.get('/run-script', (req, res) => {
  const pythonProcess = spawn('python', [join(__dirname, '..', 'public', 'youtube.py')]);

  pythonProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
    res.send(data.toString());
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    res.status(500).send(data.toString());
  });

  pythonProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
});

export default router;

