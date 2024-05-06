# YouTube API Routes Documentation

## Overview
This documentation covers the YouTube API routes for the Express server.

## Routes
- **/test**: This route renders a test message on the page.
- **/search**: This route searches for YouTube videos based on a query and renders the results on the page.
- **/trans/:videoId**: This route fetches the transcript for a YouTube video and renders the video information and transcript on the page.

## Controllers
- **youtubeController.js**: This file contains the logic for handling the YouTube API requests. It uses the axios library to make HTTP requests to the YouTube API and parses the response data.

## Models
- **youtubeModel.js**: This file defines the Mongoose schema for storing YouTube video information in the MongoDB database.

## Python Script
- **youtubePar.py**: This is a Python script that fetches the transcript for a YouTube video using the youtube_transcript_api library. It takes the video ID as a command-line argument and prints the transcript to stdout.

## Environment Variables
- **dotenv**: This is a module that loads environment variables from a .env file into process.env. It is used to store sensitive information such as API keys.

## Node.js Modules
- **path, fs, url, child_process, axios, mongoose, express**: These are Node.js modules that are used for various purposes such as file system operations, URL parsing, making HTTP requests, and interacting with a MongoDB database.