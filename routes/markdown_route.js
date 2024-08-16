import { marked } from 'marked';
import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Snippet from '../models/snippets.js';
import mongoose from 'mongoose';




const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


router.get('/snippets/', async (req, res) => {
    try {
        const snippets = await Snippet.find();
        res.json(snippets);
    } catch (err) {
        res.json({ message: err });
    }
});

//write a endpoit to delete a snippet from id
router.delete('/snippet/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const snippet = await Snippet.findByIdAndDelete(id);
        res.json({ message: 'Snippet deleted successfully' });
    } catch (err) {
        res.json({ message: err });
    }

});

router.post('/save/', async (req, res) => {
    const { snippetname, content, author } = req.body;

    // Log the incoming request data
    console.log('Received request to save snippet:', {
        snippetname,
        content,
        author
    });

    const snippet = new Snippet({
        _id: new mongoose.Types.ObjectId(),
        snippetname,
        content,
        author
    });

    try {
        const savedSnippet = await snippet.save();

        // Log the successful save operation
        console.log('Snippet saved successfully:', savedSnippet);

        res.json({ 
            message: 'Snippet saved successfully',
            id: savedSnippet._id,  // Return the _id
            snippet: savedSnippet

        });

    } catch (err) {
        // Log the error if saving the snippet fails
        console.error('Error saving snippet:', err);

        res.status(500).json({ message: err.message || 'An error occurred while saving the snippet.' });
    }
});


router.get('/blog/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../modules/blog', `${filename}`);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading file');
        } else {
            // Extract image URL from the markdown content
            const imageRegex = /!\[.*?\]\((.*?)\)/;
            const imageMatch = data.match(imageRegex);
            const imageUrlFromMarkdown = imageMatch ? imageMatch[1] : '';
            const imageTag = `<img src="${imageUrlFromMarkdown}" alt="${filename}" class="img-fluid header-image">`;
            const contentWithoutImage = data.replace(imageRegex, '');

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
                <div style="text-align: center;">
                    ${imageTag}
                </div>
                    <div class="container">
                        ${htmlContent}
                    </div>
                </body>
                </html>
            `;
            res.send(html);
        }
    });
});

export default router;
