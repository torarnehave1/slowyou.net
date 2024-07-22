import { marked } from 'marked';
import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/blog/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../modules/blog', `${filename}`);
    const imageFilename = filename.replace('.md', '.png');  // Change the extension to .png
    const imagePath = path.join(__dirname, '../public/images', imageFilename);

    console.log(imagePath);


    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading file');
        } else {
            const htmlContent = marked(data);
            let imageTag = '';
            if (fs.existsSync(imagePath)) {
                
                console.log(imagePath);
                const imageUrl = `/images/${imageFilename}`; // Use the public URL path
                imageTag = `<img src="${imageUrl}" alt="${filename}" class="img-fluid header-image">`;
            }
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
                    <div class="container">
                        ${imageTag}
                        ${htmlContent}
                    </div>
                </body>
                </html>
            `;
            res.send(html);
        }
    });
});

// Serve static files (e.g., images, styles)


export default router;
