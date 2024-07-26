import express from 'express';
import { Dropbox } from 'dropbox';
import fetch from 'node-fetch';
import axios from 'axios';
import dotenv from 'dotenv';
import os from 'os';
import { marked } from 'marked';

dotenv.config();

const router = express.Router();

// Get the hostname of the current machine
const hostname = os.hostname();
console.log(`Hostname: ${hostname}`);

// Set the environment based on the hostname
const isProduction = hostname === 'srv515168'; // Replace with your actual production hostname

// Set NODE_ENV based on the detected environment
const NODE_ENV = isProduction ? 'production' : 'development';
console.log(`Environment: ${NODE_ENV}`);

// Determine the redirect URI based on the environment
const REDIRECT_URI = NODE_ENV === 'production'
  ? process.env.DROPBOX_REDIRECT_URI_PROD
  : process.env.DROPBOX_REDIRECT_URI_DEV;

let accessToken = process.env.DROPBOX_ACCESS_TOKEN;
let refreshToken = process.env.DROPBOX_REFRESH_TOKEN;
let expiryTime = 0;

// Function to refresh the access token
async function refreshAccessToken() {
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', refreshToken);

  try {
    const response = await axios.post('https://api.dropboxapi.com/oauth2/token', params, {
      auth: {
        username: process.env.DROPBOX_APP_KEY,
        password: process.env.DROPBOX_APP_SECRET,
      },
    });

    const newAccessToken = response.data.access_token;
    const expiresIn = response.data.expires_in; // Expiry time in seconds
    expiryTime = Date.now() + expiresIn * 1000; // Current time + expiry duration in ms

    // Update the global access token
    accessToken = newAccessToken;

    return newAccessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
}

// Middleware to refresh the access token if expired
async function ensureValidToken(req, res, next) {
  if (!accessToken || Date.now() >= expiryTime) {
    try {
      accessToken = await refreshAccessToken();
    } catch (error) {
      return res.status(500).json({
        message: 'Error refreshing access token',
        error: error.message,
      });
    }
  }
  next();
}

// Endpoint to start the OAuth flow
router.get('/auth', (req, res) => {
  const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${process.env.DROPBOX_APP_KEY}&response_type=code&redirect_uri=${REDIRECT_URI}&token_access_type=offline`;
  //res.redirect(authUrl);
  console.log(authUrl);

});

// Callback endpoint to handle the authorization code
router.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  const params = new URLSearchParams();
  params.append('code', code);
  params.append('grant_type', 'authorization_code');
  params.append('client_id', process.env.DROPBOX_APP_KEY);
  params.append('client_secret', process.env.DROPBOX_APP_SECRET);
  params.append('redirect_uri', REDIRECT_URI);

  try {
    const response = await axios.post('https://api.dropboxapi.com/oauth2/token', params);
    accessToken = response.data.access_token;
    refreshToken = response.data.refresh_token;
    const expiresIn = response.data.expires_in; // Expiry time in seconds
    expiryTime = Date.now() + expiresIn * 1000; // Current time + expiry duration in ms

    res.json({
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: response.data.expires_in,
    });
  } catch (error) {
    console.error('Error obtaining tokens:', error);
    res.status(500).send('Error obtaining tokens');
  }
});

// Endpoint to list files in a folder
router.get('/list-image-files', ensureValidToken, async (req, res) => {
    const folderPath = '/Slowyou.net/Images'; // Root directory
    console.log(`Requesting path: ${folderPath}`); // Log the path being requested
  
    const dbx = new Dropbox({
      accessToken: accessToken,
      fetch: fetch,
    });
  
    try {
      const response = await dbx.filesListFolder({ path: folderPath });
      const entries = response.result.entries;
  
      // Generate temporary links for each file
      const fileEntriesWithLinks = await Promise.all(entries.map(async (entry) => {
        if (entry['.tag'] === 'file') {
          try {
            const linkResponse = await dbx.filesGetTemporaryLink({ path: entry.path_lower });
            return {
              name: entry.name,
              type: entry['.tag'],
              size: entry.size,
              modified: entry.server_modified,
              url: linkResponse.result.link
            };
          } catch (error) {
            console.error('Error getting temporary link for file:', entry.name, error);
            return null;
          }
        } else {
          return null;
        }
      }));
  
      // Filter out any null entries (failed to get temporary link)
      const validEntries = fileEntriesWithLinks.filter(entry => entry !== null);
  
      res.json(validEntries);
    } catch (error) {
      console.error('Error fetching files from Dropbox:', error);
      res.status(500).json({
        message: 'Error fetching files from Dropbox',
        error: error.error ? error.error.error_summary : error.message
      });
    }
  });
  

  router.get('/list-image-collection-links', ensureValidToken, async (req, res) => {
    const folderPath = '/Slowyou.net/markdown'; // Folder path
    console.log(`Requesting path: ${folderPath}`); // Log the path being requested
  
    const dbx = new Dropbox({
      accessToken: accessToken,
      fetch: fetch,
    });
  
    const filename = 'ImgCollection.md';
    const filePath = `${folderPath}/${filename}`;
  
    try {
      const response = await dbx.filesDownload({ path: filePath });
      const fileContent = response.result.fileBinary.toString('utf-8');

      // Extract image URL from the markdown content
      const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
      const imageMatches = fileContent.matchAll(imageRegex);
      const imageLinksAndNames = Array.from(imageMatches).map(match => ({
        name: match[1],
        url: match[2]
      }));
  
      res.json(imageLinksAndNames);
    } catch (error) {
      console.error('Error fetching markdown file from Dropbox:', error);
      res.status(500).json({
        message: 'Error fetching markdown file from Dropbox',
        error: error.error ? error.error.error_summary : error.message
      });
    }
  });

  // Image Collection Grounding

  router.get('/list-markdown-files', ensureValidToken, async (req, res) => {
    const folderPath = '/Slowyou.net/markdown'; // Folder path
    console.log(`Requesting path: ${folderPath}`); // Log the path being requested
  
    const dbx = new Dropbox({
      accessToken: accessToken,
      fetch: fetch,
    });
  
    try {
      const response = await dbx.filesListFolder({ path: folderPath });
      const entries = await Promise.all(response.result.entries.map(async entry => {
        if (entry['.tag'] === 'file' && entry.name.endsWith('.md')) {
          const linkResponse = await dbx.filesGetTemporaryLink({ path: entry.path_lower });
          return {
            name: entry.name,
            type: entry['.tag'],
            size: entry.size,
            modified: entry.server_modified,
            url: linkResponse.result.link
          };
        }
        return null;
      }));
  
      const validEntries = entries.filter(entry => entry !== null);
      res.json(validEntries);
    } catch (error) {
      console.error('Error fetching files from Dropbox:', error);
      res.status(500).json({
        message: 'Error fetching files from Dropbox',
        error: error.error ? error.error.error_summary : error.message
      });
    }
  });
  
  // Endpoint to fetch and render a markdown file
  router.get('/blog/:filename', ensureValidToken, async (req, res) => {
    const filename = req.params.filename;
    const filePath = `/Slowyou.net/markdown/${filename}`;
  
    const dbx = new Dropbox({
      accessToken: accessToken,
      fetch: fetch,
    });
  
    try {
      const response = await dbx.filesDownload({ path: filePath });
      const fileContent = response.result.fileBinary.toString('utf-8');

      // Extract image URL from the markdown content
      const imageRegex = /!\[.*?\]\((.*?)\)/;
      const imageMatch = fileContent.match(imageRegex);
      const imageUrlFromMarkdown = imageMatch ? imageMatch[1] : '';
      const imageTag = `<img src="${imageUrlFromMarkdown}" alt="${filename}" class="img-fluid header-image">`;
      const contentWithoutImage = fileContent.replace(imageRegex, '');

      const htmlContent = marked(contentWithoutImage);
  
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Blog Post</title>
            <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body { font-family: Arial, sans-serif; margin: 2em; }
                pre { background: #f4f4f4; padding: 1em; }
                code { background: #f4f4f4; padding: 0.2em; }
                .header-image { width: 100%; max-height: 300px; object-fit: cover; margin-bottom: 20px; }
            </style>
        </head>
        <body>
        
        <div id="menu-container"></div> 
        <div style="text-align: center;">
            ${imageTag}
        </div>
            <div class="container">
                ${htmlContent}
            </div>
        </body>
        <script>
        function loadMenu() {
                fetch('/menu.html')
                    .then(response => response.text())
                    .then(data => {
                        document.getElementById('menu-container').innerHTML = data;
                        initializeLanguageSelector(); // Initialize the language selector after loading the menu
                        checkAuthStatus(); // Check auth status after loading the menu
                    })
                    .catch(error => console.error('Error loading menu:', error));
            }

            document.addEventListener('DOMContentLoaded', () => {
                console.log("DOM fully loaded and parsed");
                loadMenu();
            });
        </script>
        </html>
      `;
  
      res.send(html);
    } catch (error) {
      console.error('Error fetching file from Dropbox:', error);
      res.status(500).json({
        message: 'Error fetching file from Dropbox',
        error: error.error ? error.error.error_summary : error.message
      });
    }
});


router.get('/project/:filename', ensureValidToken, async (req, res) => {
  const filename = req.params.filename;
  const filePath = `/Slowyou.net/projects/${filename}`;

  const dbx = new Dropbox({
    accessToken: accessToken,
    fetch: fetch,
  });

  try {
    const response = await dbx.filesDownload({ path: filePath });
    const fileContent = response.result.fileBinary.toString('utf-8');

    // Extract image URL from the markdown content
    const imageRegex = /!\[.*?\]\((.*?)\)/;
    const imageMatch = fileContent.match(imageRegex);
    const imageUrlFromMarkdown = imageMatch ? imageMatch[1] : '';
    const imageTag = `<img src="${imageUrlFromMarkdown}" alt="${filename}" class="img-fluid header-image">`;
    const contentWithoutImage = fileContent.replace(imageRegex, '');

    const htmlContent = marked(contentWithoutImage);

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Project Suggestion</title>
          <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
          <style>
              body { font-family: Arial, sans-serif; margin: 2em; }
              pre { background: #f4f4f4; padding: 1em; }
              code { background: #f4f4f4; padding: 0.2em; }
              .header-image { width: 100%; max-height: 300px; object-fit: cover; margin-bottom: 20px; }
          </style>
      </head>
      <body>
      
      <div id="menu-container"></div> 
      <div style="text-align: center;">
          ${imageTag}
      </div>
          <div class="container">
              ${htmlContent}
          </div>
      </body>
      <script>
      function loadMenu() {
              fetch('/menu.html')
                  .then(response => response.text())
                  .then(data => {
                      document.getElementById('menu-container').innerHTML = data;
                      initializeLanguageSelector(); // Initialize the language selector after loading the menu
                      checkAuthStatus(); // Check auth status after loading the menu
                  })
                  .catch(error => console.error('Error loading menu:', error));
          }

          document.addEventListener('DOMContentLoaded', () => {
              console.log("DOM fully loaded and parsed");
              loadMenu();
          });
      </script>
      </html>
    `;

    res.send(html);
  } catch (error) {
    console.error('Error fetching file from Dropbox:', error);
    res.status(500).json({
      message: 'Error fetching file from Dropbox',
      error: error.error ? error.error.error_summary : error.message
    });
  }
});


router.get('/imgcollection/:filename', ensureValidToken, async (req, res) => {
  const filename = req.params.filename;
  const filePath = `/Slowyou.net/projects/${filename}`;

  const dbx = new Dropbox({
    accessToken: accessToken,
    fetch: fetch,
  });

  try {
    const response = await dbx.filesDownload({ path: filePath });
    const fileContent = response.result.fileBinary.toString('utf-8');

    // Extract image URL from the markdown content
    
    const htmlContent = marked(fileContent);

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Project Suggestion</title>
          <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
          <style>
              body { font-family: Arial, sans-serif; margin: 2em; }
              pre { background: #f4f4f4; padding: 1em; }
              code { background: #f4f4f4; padding: 0.2em; }
              .header-image { width: 100%; max-height: 300px; object-fit: cover; margin-bottom: 20px; }
          </style>
      </head>
      <body>
      
      <div id="menu-container"></div> 
  
          <div class="container">
              ${htmlContent}
          </div>
      </body>
      <script>
      function loadMenu() {
              fetch('/menu.html')
                  .then(response => response.text())
                  .then(data => {
                      document.getElementById('menu-container').innerHTML = data;
                      initializeLanguageSelector(); // Initialize the language selector after loading the menu
                      checkAuthStatus(); // Check auth status after loading the menu
                  })
                  .catch(error => console.error('Error loading menu:', error));
          }

          document.addEventListener('DOMContentLoaded', () => {
              console.log("DOM fully loaded and parsed");
              loadMenu();
          });
      </script>
      </html>
    `;

    res.send(html);
  } catch (error) {
    console.error('Error fetching file from Dropbox:', error);
    res.status(500).json({
      message: 'Error fetching file from Dropbox',
      error: error.error ? error.error.error_summary : error.message
    });
  }
});


export default router;
