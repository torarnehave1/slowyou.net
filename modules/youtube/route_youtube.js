import express from 'express';
import { join } from 'path';
import { mkdirSync, writeFile } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { appendFile } from 'fs';
import axios from 'axios';
import { connect, Schema, model } from 'mongoose';
import { spawn } from 'child_process';
import dotenv from 'dotenv';
import config from '../../config/config.js';



console.log(`The application is running PYTHON VERSION ${config.PYTHON_VERSION}.`);

dotenv.config();


const apiKey = process.env.YOUTUBE_API_KEY;
const apiUrl = 'https://www.googleapis.com/youtube/v3/search';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const router = express.Router();

// Creat e comment on this code with suggestion TODO
// Create a new route for the YouTube API



//http://localhost:3000/youtube/search?q=Mindfulness

router.get('/test', (req, res) => {

  console.log(__dirname);

  res.render('test', { message: 'This is a test message from the Youtube END POINT' });
});


router.get('/search', async (req, res) => {
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'id,snippet',
          q: req.query.q, // 'Mindfulness',
          maxResults: 50,
          key: process.env.YOUTUBE_API_KEY,
          type: 'video'
        },
      });
  
      //res.render('youtube_test', { activeTab: 'tab2', items: response.data.items });
      //res.render('view_youtube_test', { activeTab: 'tab2', items: response.data.items, transcript: [] });
      
      //res.render(path.join(__dirname, 'modules/youtube/views/view_youtube_test'), { /* your data */ });

      res.render('view_youtube_wjspering', { 
        activeTab: 'tab2', 
        items: response.data.items, 
        transcript: [], 
        logoUrl: '/partials/logo_ww.png' 
      });

      //logoUrl: '/path/to/logo.png' //res.render('youtube_search_results', { items: response.data.items });
      //res.json(response.data);
      //console.log('response.data:', response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
      res.status(500).json({ error: 'Error fetching videos' });
    }
  });
  

  router.get('/trans/:videoId', async (req, res) => {
    const videoId = req.params.videoId;

    try {
        // Get video information from YouTube API
        const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                part: 'snippet,statistics',
                id: videoId,
                key: process.env.YOUTUBE_API_KEY,
            },
        });

        const videoInfo = response.data.items[0]; // Get the first item from the response
      
        // Change this into python3 in production
const py_ver = config.PYTHON_VERSION

        const pythonProcess = spawn(py_ver, [join(__dirname, '..', '..', 'modules', 'micro', 'transcript_pdf.py'), videoId]);
        let transcript = '';

        pythonProcess.stdout.on('data', (data) => {
            transcript += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            // Ensure to end the process on stderr and avoid sending multiple responses
            if (!res.headersSent) {
                res.status(500).send(data.toString());
            }
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                if (!res.headersSent) {
                    return res.status(500).send(`Python script exited with code ${code}`);
                }
            } else {
                try {
                    const jsonData = JSON.parse(transcript);
                    if (!res.headersSent) {
                        res.render('view_youtube_wjspering', {
                            activeTab: 'tab1',
                            items: [videoInfo],
                            transcript: jsonData,
                        });
                    }
                } catch (err) {
                    if (!res.headersSent) {
                        res.status(500).send('Error parsing JSON data');
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error fetching video information:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Error fetching video information' });
        }
    }
});




  export default router;