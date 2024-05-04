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
dotenv.config();


const apiKey = process.env.YOUTUBE_API_KEY;
const apiUrl = 'https://www.googleapis.com/youtube/v3/search';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const router = express.Router();

//http://localhost:3000/youtube/search?q=Mindfulness
router.get('/message', (req, res) => {
    res.render('test', { message: 'This is a test message' });
  });


router.get('/search', async (req, res) => {
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'id,snippet',
          q: req.query.q, // 'Mindfulness',
          maxResults: 10,
          key: process.env.YOUTUBE_API_KEY,
          type: 'video'
        },
      });
  
      //res.render('youtube_test', { activeTab: 'tab2', items: response.data.items });
      //res.render('view_youtube_test', { activeTab: 'tab2', items: response.data.items, transcript: [] });
      
      res.render('view_youtube_test', { 
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
  
      const pythonProcess = spawn('python3', [join(__dirname, '..', 'public', 'youtubepar.py'), videoId]);
  
      let transcript = '';
  
      pythonProcess.stdout.on('data', (data) => {
        const dataString = data.toString();
        console.log(dataString);
        transcript += dataString;
      });
  
      pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        res.status(500).send(data.toString());
      });
  
      pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        if (code !== 0) {
          return res.status(500).send(`Python script exited with code ${code}`);
        }
        try {
          const jsonData = JSON.parse(transcript);
          // Add videoInfo to the render function
          res.render('view_youtube_test',
           { activeTab: 'tab1',
            items: [videoInfo], 
            transcript: jsonData, 
          });
  
        } catch (err) {
          res.status(500).send('Error parsing JSON data');
        }
      });
    } catch (error) {
      console.error('Error fetching video information:', error);
      res.status(500).json({ error: 'Error fetching video information' });
    }
  });
  

  export default router;