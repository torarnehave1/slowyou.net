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

import pkg  from 'youtube-transcript';
const { YouTubeTranscript } = pkg

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


router.get('/trans/markdown/:videoId', async (req, res) => {
    const { videoId } = req.params;

    try {
        // Validate video ID
        if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
            return res.status(400).send('Invalid or missing video ID');
        }

        // Fetch video metadata
        const videoResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                part: 'snippet',
                id: videoId,
                key: process.env.YOUTUBE_API_KEY,
            },
        });

        const videoInfo = videoResponse.data.items[0];
        if (!videoInfo) {
            return res.status(404).send('Video not found');
        }

        // Use the configured Python version
        const py_ver = config.PYTHON_VERSION;

        // Call the Python script to generate Markdown transcript
        const pythonProcess = spawn(py_ver, [
            path.join(__dirname, '..', '..', 'modules', 'micro', 'transcript_markdown.py'),
            videoId,
        ]);

        let transcript = '';
        let errorOutput = '';

        pythonProcess.stdout.on('data', (data) => {
            transcript += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
            console.error(`stderr: ${data}`);
            if (!res.headersSent) {
                res.status(500).send(data.toString());
            }
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                if (!res.headersSent) {
                    console.error('Python script exited with non-zero code:', code);
                    res.status(500).send(`Python script exited with code ${code}`);
                }
            } else {
                if (!res.headersSent) {
                    // Combine metadata and transcript into Markdown format with dynamic iframe embedding
                    const metadataMarkdown = `
# ${videoInfo.snippet.title}

## Description  
${videoInfo.snippet.description}

## Channel  
${videoInfo.snippet.channelTitle}

## Watch the Video  
[![Watch on YouTube](https://img.youtube.com/vi/${videoId}/hqdefault.jpg)](https://www.youtube.com/watch?v=${videoId})

<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Published Date  
${new Date(videoInfo.snippet.publishedAt).toLocaleString()}

---

# Transcript
${transcript}
                    `.trim();

                    // Set response type to Markdown and send the response
                    res.setHeader('Content-Type', 'text/markdown');
                    res.send(metadataMarkdown);
                }
            }
        });
    } catch (error) {
        console.error('Error processing request:', error.message);
        if (!res.headersSent) {
            res.status(500).send('Failed to retrieve or process video metadata or transcript');
        }
    }
});





router.get('/BAKtrans/markdown/:videoId', async (req, res) => {
    const { videoId } = req.params;

    console.debug('Received request for videoId:', videoId);

    try {
        // Validate videoId
        if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
            console.debug('Invalid or missing video ID:', videoId);
            return res.status(400).send('Invalid or missing video ID');
        }

        // Fetch video information from YouTube API
        console.debug('Fetching video information for videoId:', videoId);
        const videoResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                part: 'snippet',
                id: videoId,
                key: process.env.YOUTUBE_API_KEY,
            },
        });

        const videoInfo = videoResponse.data.items[0];
        console.debug('Video information fetched:', videoInfo);

        if (!videoInfo) {
            console.debug('Video not found for videoId:', videoId);
            return res.status(404).send('Video not found');
        }

        // Fetch transcript
        console.debug('Fetching transcript for videoId:', videoId);
        const transcript = await YouTubeTranscript.fetchTranscript(videoId);
        console.debug('Transcript fetched:', transcript);

        if (!transcript || transcript.length === 0) {
            console.debug('Transcript not available for videoId:', videoId);
            return res.status(404).send('Transcript not available for this video');
        }

        // Convert transcript to Markdown
        console.debug('Converting transcript to Markdown for videoId:', videoId);
        const markdown = transcript.map(entry => {
            const timestamp = new Date(entry.start * 1000).toISOString().substring(11, 19).replace(/\.\d{3}Z$/, ''); // Convert seconds to HH:mm:ss
            return `**[${timestamp}]** ${entry.text}`;
        }).join('\n\n');

        // Send Markdown response
        console.debug('Sending Markdown response for videoId:', videoId);
        res.setHeader('Content-Type', 'text/markdown');
        res.send(markdown);
    } catch (error) {
        console.error('Error processing request:', error.message);

        if (error.response) {
            if (error.response.status === 404) {
                console.debug('Transcript or video not found for videoId:', videoId);
                return res.status(404).send('Transcript or video not found');
            }
        }

        res.status(500).send('Failed to retrieve or convert transcript');
    }
});


  export default router;

function importYouTubeTranscript() {
    return require('youtube-transcript');
}
