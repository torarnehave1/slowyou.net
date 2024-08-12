<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown File Viewer</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { font-family: Arial, sans-serif; margin: 2em; }
        .file-list { margin-top: 20px; display: flex; flex-wrap: wrap; gap: 20px; }
        .card {
            width: 18rem; /* Adjust the width as needed */
            margin-bottom: 20px;
        }
        .card-content {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
        }
        .card-img-top {
            max-height: 150px;
            object-fit: cover;
        }
    </style>
</head>
<body>
    <div id="menu-container"></div>
    <h1>Markdown File Viewer</h1>

    <div class="file-list" id="fileList"></div>

    <script>
        const apiUrl = '/dropbox/list-markdown-files';

        async function fetchFiles() {
            try {
                const response = await fetch(apiUrl);
                const files = await response.json();
                renderFileList(files);
            } catch (error) {
                console.error('Error fetching files:', error);
            }
        }

        async function fetchFilePreview(fileUrl) {
            try {
                const response = await fetch(fileUrl);
                const text = await response.text();
                const lines = text.split('\n');
                
                // Extract image URL from the first line if present
                const imgMatch = lines[0].match(/!\[.*?\]\((.*?)\)/);
                const imgUrl = imgMatch ? imgMatch[1] : '';

                const previewText = lines.slice(1, 6).join(' '); // Get the first 5 lines as preview (excluding the image line)
                
                return { previewText, imgUrl };
            } catch (error) {
                console.error('Error fetching file preview:', error);
                return { previewText: 'Error loading preview', imgUrl: '' };
            }
        }

        async function renderFileList(files) {
            const fileList = document.getElementById('fileList');
            fileList.innerHTML = '';

            for (const file of files) {
                if (file.type === 'file' && file.name.endsWith('.md')) {
                    const { previewText, imgUrl } = await fetchFilePreview(file.url);
                    
                    const fileItem = document.createElement('div');
                    fileItem.className = 'card';

                    fileItem.innerHTML = `
                        ${imgUrl ? `<img src="${imgUrl}" class="card-img-top" alt="Image">` : ''}
                        <div class="card-body">
                            <h5 class="card-title">${file.name}</h5>
                            <p class="card-content">
                                ${previewText}
                            </p>
                            <a href="/dropbox/md/${file.name}" target="_blank" class="btn btn-primary">Read more</a>
                        </div>
                    `;
                    fileList.appendChild(fileItem);
                }
            }
        }

        // Fetch files on page load
        fetchFiles();

        function loadMenu() {
            fetch('./menu.html')
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
</body>
</html>
