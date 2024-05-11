import express from 'express';
import { exec } from 'child_process';


const router = express.Router();


router.get('/run-command', (req, res) => {
  const command = 'bash /var/www/html/slowyou.net/s.sh';

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      res.status(500).send('An error occurred while executing the command.');
      return;
    }

    if (stderr) {
      console.warn(`stderr: ${stderr}`);
      res.status(500).send('An error occurred while executing the command.');
      return;
    }

    console.log(`stdout: ${stdout}`);
    res.send('Command executed successfully.');
  });

