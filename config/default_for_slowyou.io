# HTTPS server configuration for slowyou.io
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name slowyou.io www.slowyou.io;

    # SSL Certificate Configuration
    ssl_certificate /etc/letsencrypt/live/slowyou.io-0001/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/slowyou.io-0001/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Define the root where the application code and static files are located
    root /var/www/html/slowyouio;

    # Serve static files and PHP scripts from the 'public' subdirectory
    location / {
        try_files $uri $uri/ /public/$uri /public/$uri/ @nodejs;
    }

    location /api/users {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}

    # PHP file execution
    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_pass unix:/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Capture non-static file requests and redirect them to the Node.js app
    location @nodejs {
        proxy_pass http://localhost:3000;  # Adjust this if your app listens on a different port
        include /etc/nginx/proxy_params;  # Standard proxy settings

        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
        add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range';
    }

    # Specific location for static files and enabling SSI
    location ~* ^/public/(.+\.(jpeg|jpg|png|gif|css|js|ico|html|xml|txt|svg))$ {
        root /var/www/html/slowyouio;
        try_files /public/$1 =404;
        access_log off;
        expires max;
        add_header Cache-Control "public";
        ssi on;  # Enable SSI processing on static files
    }
}

server {
    listen 80;
    server_name slowyou.io www.slowyou.io;
    return 301 https://$server_name$request_uri;
}