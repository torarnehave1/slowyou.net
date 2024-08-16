import { Router } from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';


import axios from 'axios';

import sharp from 'sharp';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const router = Router();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

//write a test end point to see if I can connect to openai


router.get('/test', async (req, res) => {

    try {

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "Who won the world series in 2020?" },
            ],
        });

        res.json({ response: completion.choices[0].message.content });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to get response from OpenAI' });
    }

});




// Define the route for handling OpenAI requests
router.post('/ask', async (req, res) => {
    const { question } = req.body;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You will answer back in a professinal way with markdown format and titles where it is appropriate" },
                { role: "user", content: question },
            ],
        });

        res.json({ response: completion.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to get response from OpenAI' });
    }
});


router.post('/create-image', async (req, res) => {
    const { prompt } = req.body;  // Get the prompt from the request body

    try {
        const response = await openai.images.create({
            model: "dall-e-2",
            prompt: prompt,  // Use the prompt provided in the request
            n: 1,
            size: "1024x341"
        });

        const imageUrl = response.data[0].url;
        res.json({ imageUrl });
    } catch (error) {
        console.error('Error creating image:', error);
        res.status(500).json({ error: 'Failed to create image' });
    }
});



router.get('/createimage', async (req, res) => {
    const prompt = req.query.prompt;  // Get the prompt from the query parameters

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const response = await openai.images.generate({
            model: "dall-e-2",  // Ensure this is the correct model for your API version
            prompt: prompt,
            n: 1,
            size: "1024x1024"  // Generate a square image
        });

        const imageUrl = response.data[0].url;

        // Download the image from the URL
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(imageResponse.data, 'binary');

        // Process the image to crop to 1024x341
        const croppedImageBuffer = await sharp(imageBuffer)
            .resize(1024, 341)  // Resize to 1024x341
            .toBuffer();

        const timestamp = Date.now();
        const imageFilePath = path.join(__dirname,'..', '/public/images', `image_${timestamp}.png`);
        console.log(imageFilePath);

        fs.writeFileSync(imageFilePath, croppedImageBuffer);

        res.json({ message: 'Image saved successfully', imageFilePath, imageUrl });
    } catch (error) {
        console.error('Error creating image:', error);
        res.status(500).json({ error: 'Failed to create image' });
    }
});


export default router;
