import express from 'express';
import { Dropbox } from 'dropbox';
import fetch from 'node-fetch';
import axios from 'axios';
import dotenv from 'dotenv';
import os from 'os';

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
router.get('/list-files', ensureValidToken, async (req, res) => {
  const folderPath = '/Slowyou.net/Images'; // Root directory
  console.log(`Requesting path: ${folderPath}`); // Log the path being requested

  const dbx = new Dropbox({
    accessToken: accessToken,
    fetch: fetch,
  });

  try {
    const response = await dbx.filesListFolder({ path: folderPath });
    const entries = response.result.entries.map(entry => ({
      name: entry.name,
      type: entry['.tag'],
      size: entry.size,
      modified: entry.server_modified,
      path: entry.path_display
    }));

    res.json(entries);
  } catch (error) {
    console.error('Error fetching files from Dropbox:', error);
    res.status(500).json({
      message: 'Error fetching files from Dropbox',
      error: error.error ? error.error.error_summary : error.message
    });
  }
});

export default router;
