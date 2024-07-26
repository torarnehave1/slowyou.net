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
// Serve static files (e.g., images, styles)


export default router;
