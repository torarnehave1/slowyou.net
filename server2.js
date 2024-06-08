// Import the express module
import express from 'express';
import bodyParser from 'body-parser';
import testRoutes from './routes/testRoutes.js';
import dbRoutes from './modules/mongodb/dbRoutes.js';
import jsonRoutes from './routes/jsonRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { connect } from 'mongoose';
import dotenv from 'dotenv';
import { auth } from 'express-openid-connect';
import personRoutes from './routes/personRoutes.js';
import githubRoutes from './modules/github/route_github.js';
import pyprocess from './routes/pyprocess.js';
import youtubeRoutes from "./modules/youtube/route_youtube.js";
import emailRoutes from "./modules/email/routes_email.js";
import crmRoutes from "./modules/crm/routes_crm.js";
import webpagesRoutes from "./modules/webpages/pages.js";
import groq from './modules/api/groq.js';
import {Client} from "appwrite";
import axios from 'axios';



dotenv.config(); // Load environment variables


const API_ENDPOINT = process.env.API_ENDPOINT;
const API_PROJECT_ID = process.env.PROJECT_ID;

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('66125cc2421670bd43a8') // Your project ID


const app = express();
const port = 3000;

  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  app.use(bodyParser.json());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  app.set('view engine', 'ejs'); // or 'pug', 'hbs', etc.
  app.set('views', path.join(__dirname, 'views'));
  

  app.get('/health', async (req, res) => {
    try {
        const response = await axios.get(`${API_ENDPOINT}`, {
            headers: {
                'X-Appwrite-Project': API_PROJECT_ID
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error connecting to the API endpoint', error: error.message });
    }
});


// Define a route handler for the root URL
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
