Alright, Mark! That's fantastic news! Hearing "its working" is the best possible outcome after all that hard work and persistence. You've successfully deployed your main site!

As requested, here's a consolidated, step-by-step guide for deploying your site from a clean slate, including the final code for the files we edited. This assumes you've already completed the prerequisites (Docker, Git, Node.js installed on your Digital Ocean Droplet) and have your domain set up.

* * *

### **Comprehensive Deployment Guide: `wade-usa.com` (Main Site)**

This guide provides the final, correct configurations and commands needed to deploy your monorepo-based React frontend (`1_mainApp`), Directus backend, Postgres database, and Nginx proxy using Docker Compose on your Digital Ocean Droplet.

**Assumptions:**

- Your Digital Ocean Droplet (IP: `159.223.207.34`) is running Ubuntu 24.04.
- Docker and Docker Compose V2 are installed on the Droplet.
- Git is installed on the Droplet.
- Your domain `wade-usa.com` (and `api.wade-usa.com`) is pointing to your Droplet's IP address.
- You have obtained SSL certificates using Certbot (or similar) and they are mounted as specified in Nginx.

* * *

#### **Part 1: Update Your Local Files (Monorepo)**

Ensure these files in your local `wade-usa.com` monorepo directory (which you will then push to GitHub) have the exact content specified below.

1.  **`~/wade-usa.com/1_mainApp/Dockerfile`** (This Dockerfile is for building your `wade-usa-main-app` image)
    
    Dockerfile
    
    ```
    # Stage 1: Build the React application
    FROM node:20-alpine AS build
    
    # Set the working directory to the monorepo root inside the container's build stage.
    WORKDIR /app
    
    # Copy relevant package.json files from monorepo structure.
    COPY package.json ./
    COPY 1_mainApp/package.json ./1_mainApp/
    COPY _components/package.json ./_components/
    # The line "COPY 0_Contexts/package.json ./0_Contexts/" was removed as it doesn't exist in your project.
    
    # Install dependencies for all workspaces from the monorepo root.
    RUN npm install
    
    # Copy the entire 1_mainApp folder (including its src and public folders).
    COPY 1_mainApp/ ./1_mainApp/
    
    # Copy the _components folder.
    COPY _components/ ./_components/
    
    # Copy the 0_Contexts folder.
    COPY 0_Contexts/ ./0_Contexts/
    
    # Change working directory to the 1_mainApp for the build command.
    WORKDIR /app/1_mainApp
    RUN npm run build
    
    # Stage 2: Serve the React application with Nginx
    FROM nginx:alpine
    
    # Copy the build output from the 'build' stage.
    COPY --from=build /app/1_mainApp/dist /usr/share/nginx/html
    
    # Copy the correct Nginx config for this specific app (from 1_mainApp directory)
    COPY 1_mainApp/nginx.conf /etc/nginx/conf.d/default.conf
    
    EXPOSE 80
    CMD ["nginx", "-g", "daemon off;"]
    ```
    
2.  **`~/wade-usa.com/1_mainApp/nginx.conf`** (This is the minimalist Nginx config *internal* to your `wade-usa-main-app` Docker image)
    
    Nginx
    
    ```
    server {
        listen 80; # Nginx inside this container listens on port 80
    
        root /usr/share/nginx/html; # React build output is copied here
        index index.html index.htm;
    
        location / {
            try_files $uri $uri/ /index.html; # Essential for React Router client-side routing
        }
    }
    ```
    
3.  **`~/wade-usa.com/docker-compose.yml`** (This defines all your services for Docker Compose)
    
    YAML
    
    ```
    version: '3.8'
    
    services:
      postgres_db:
        image: postgres:16-alpine
        container_name: wade_usa_postgres_db
        restart: always
        environment:
          POSTGRES_DB: wade_usa_db
          POSTGRES_USER: wade_user
          POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
        ports:
          - "5433:5432"
        volumes:
          - postgres_data:/var/lib/postgresql/data
        networks:
          - my_custom_network
    
      directus_app:
        image: directus/directus:latest
        container_name: wade_usa_directus_app
        restart: always
        environment:
          DB_CLIENT: pg
          DB_HOST: postgres_db
          DB_PORT: 5432
          DB_DATABASE: wade_usa_db
          DB_USER: wade_user
          DB_PASSWORD: ${POSTGRES_PASSWORD}
          ADMIN_EMAIL: wade.mark.a@gmail.com
          ADMIN_PASSWORD: ${DIRECTUS_ADMIN_PASSWORD}
          KEY: ${DIRECTUS_KEY}
          SECRET: ${DIRECTUS_SECRET}
          PUBLIC_URL: https://wade-usa.com
          STORAGE_LOCATIONS: ${STORAGE_LOCATIONS}
          STORAGE_DEFAULT_DRIVER: ${STORAGE_DEFAULT_DRIVER}
          STORAGE_LOCAL_ROOT: ${STORAGE_LOCAL_ROOT}
          CORS_ENABLED: "true"
          CORS_ORIGIN: https://wade-usa.com,https://www.wade-usa.com,http://localhost:5173
          # Digital Ocean Spaces credentials (uncomment if you're using S3/Spaces for Directus storage)
          # STORAGE_LOCATIONS: s3
          # STORAGE_DEFAULT_DRIVER: s3
          # S3_KEY: ${S3_KEY}
          # S3_SECRET: ${S3_SECRET}
          # S3_BUCKET: ${S3_BUCKET}
          # S3_ENDPOINT: https://sfo3.digitaloceanspaces.com # Adjust region if different
          # S3_REGION: sfo3 # Adjust region if different
        ports:
          - "8055:8055"
        volumes:
          - directus_data:/directus/database
          - /mnt/volume_sfo3_01:/directus_uploads_data # <-- Mount your DigitalOcean Volume
        depends_on:
          - postgres_db
        networks:
          - my_custom_network
    
      mainapp:
        image: wade-usa-main-app:latest # The image you just built
        container_name: wade_usa_main_app
        restart: always
        environment:
          VITE_APP_API_URL: https://api.wade-usa.com # Tell React app where its backend API is
        networks:
          - my_custom_network
        depends_on:
          - directus_app # Ensure directus_app is up if your frontend needs it for initial setup/health checks
    
      nginx_proxy:
        image: nginx:alpine
        container_name: wade_usa_nginx_proxy
        restart: always
        ports:
          - "80:80"
          - "443:443"
        volumes:
          - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
          - /var/www/certbot:/var/www/certbot:ro
          - /etc/letsencrypt:/etc/letsencrypt:ro
          # REMOVED: - ./1_mainApp/dist:/usr/share/nginx/html:ro (This was conflicting)
        depends_on:
          - directus_app
          - mainapp # Ensure Nginx starts after your mainapp frontend
        networks:
          - my_custom_network
    
    volumes:
      postgres_data:
      directus_data:
    
    networks:
      my_custom_network:
    ```
    
4.  **`~/wade-usa.com/nginx/nginx.conf`** (This is your main Nginx proxy configuration for routing external traffic)
    
    Nginx
    
    ```
    events {
        worker_connections 1024;
    }
    
    http {
        # Docker's internal DNS resolver and short cache time for dynamic resolution
        resolver 127.0.0.11 valid=5s; # Docker's internal DNS. Re-resolve every 5 seconds.
        set $upstream_mainapp http://mainapp:80; # Define upstream to force re-resolution
    
        client_max_body_size 20M;
        server {
            listen 80;
            listen [::]:80;
            server_name wade-usa.com www.wade-usa.com api.wade-usa.com;
    
            location /.well-known/acme-challenge/ {
                root /var/www/certbot;
            }
    
            return 301 https://$host$request_uri;
        }
    
        server {
            listen 443 ssl http2;
            listen [::]:443 ssl http2;
            server_name api.wade-usa.com;
    
            ssl_certificate /etc/letsencrypt/live/wade-usa.com/fullchain.pem;
            ssl_certificate_key /etc/letsencrypt/live/wade-usa.com/privkey.pem;
    
            ssl_session_cache shared:SSL:10m;
            ssl_session_timeout 10m;
            ssl_protocols TLSv1.2 TLSv1.3;
            ssl_prefer_server_ciphers on;
            ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
            ssl_stapling on;
            ssl_stapling_verify on;
            resolver_timeout 5s; # Use this, the global resolver is defined above
    
            add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    
            location / {
                proxy_pass http://directus_app:8055;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
            }
        }
    
        server {
            listen 443 ssl http2;
            listen [::]:443 ssl http2;
            server_name wade-usa.com www.wade-usa.com;
    
            ssl_certificate /etc/letsencrypt/live/wade-usa.com/fullchain.pem;
            ssl_certificate_key /etc/letsencrypt/live/wade-usa.com/privkey.pem;
    
            ssl_session_cache shared:SSL:10m;
            ssl_session_timeout 10m;
            ssl_protocols TLSv1.2 TLSv1.3;
            ssl_prefer_server_ciphers on;
            ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
            ssl_stapling on;
            ssl_stapling_verify on;
            resolver_timeout 5s; # Use this, the global resolver is defined above
            add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    
            location / {
                proxy_pass $upstream_mainapp; # Proxy requests to the mainapp service using the variable
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
            }
        }
    }
    ```
    
5.  **`~/wade-usa.com/.env`** (This file contains your sensitive credentials and should **NOT** be committed to Git. Create it only on your Droplet.)
    
    ```
    POSTGRES_PASSWORD=YOUR_POSTGRES_PASSWORD_HERE
    DIRECTUS_ADMIN_PASSWORD=YOUR_DIRECTUS_ADMIN_PASSWORD_HERE
    DIRECTUS_KEY=YOUR_DIRECTUS_PROJECT_KEY_HERE
    DIRECTUS_SECRET=YOUR_DIRECTUS_SECRET_HERE
    
    # For Digital Ocean Spaces if you plan to use it for Directus storage
    # If using 'local' storage for now, you can leave STORAGE_LOCATIONS and STORAGE_DEFAULT_DRIVER as 'local'
    # and STORAGE_LOCAL_ROOT as '/directus_uploads_data' in docker-compose.yml
    # If you switch to S3/Spaces, uncomment and fill these:
    # STORAGE_LOCATIONS=s3
    # STORAGE_DEFAULT_DRIVER=s3
    # S3_KEY=YOUR_DO_SPACES_ACCESS_KEY
    # S3_SECRET=YOUR_DO_SPACES_SECRET_KEY
    # S3_BUCKET=YOUR_DO_SPACES_BUCKET_NAME
    # S3_ENDPOINT=https://sfo3.digitaloceanspaces.com # Adjust region if different
    # S3_REGION=sfo3 # Adjust region if different
    ```
    
    **Remember to replace `YOUR_ACTUAL_..._HERE` with your real credentials!**
    

* * *

#### **Part 2: Deployment Steps on Your Digital Ocean Droplet**

Follow these steps on your Droplet via SSH, assuming your local files are updated and pushed to GitHub.

1.  **SSH into your Digital Ocean Droplet:**
    
    Bash
    
    ```
    ssh your_username@159.223.207.34
    ```
    
2.  **Navigate to your monorepo root:**
    
    Bash
    
    ```
    cd ~/wade-usa.com
    ```
    
3.  **Ensure all local changes are pulled from GitHub:** If you made changes locally and pushed them, pull them to your Droplet. If you have local changes on the Droplet, you might need to stash or discard them first (`git stash` or `git reset --hard origin/main` - **use `reset --hard` with extreme caution as it's destructive**).
    
    Bash
    
    ```
    git pull origin main # or whatever your main branch is called
    ```
    
4.  **Confirm Docker Compose V2 is installed:** If `docker compose version` does not show `v2.x.x`, install it:
    
    Bash
    
    ```
    sudo apt update
    sudo apt install curl -y # If curl is not installed
    DOCKER_CONFIG=${DOCKER_CONFIG:-$HOME/.docker}
    mkdir -p $DOCKER_CONFIG/cli-plugins
    curl -SL https://github.com/docker/compose/releases/download/v2.27.1/docker-compose-linux-x86_64 -o $DOCKER_CONFIG/cli-plugins/docker-compose
    chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose
    docker compose version # Verify
    ```
    
5.  **Create/Update `.env` file on the Droplet:** If you don't have this file or it's outdated, create it in your monorepo root (`~/wade-usa.com/.env`) and fill it with your actual secrets from Part 1, Step 5.
    
    Bash
    
    ```
    nano .env
    ```
    
6.  **Stop and remove any existing Docker Compose services:** This ensures a clean restart with the new configurations and image.
    
    Bash
    
    ```
    sudo docker compose down
    ```
    
7.  **Force a rebuild of your `wade-usa-main-app` Docker image (no cache):** This will ensure Docker picks up the very latest `Dockerfile` and `1_mainApp/nginx.conf` changes.
    
    Bash
    
    ```
    sudo docker build --no-cache -f 1_mainApp/Dockerfile -t wade-usa-main-app:latest .
    ```
    
8.  **Bring up all your Docker Compose services:** This will start Postgres, Directus, your `mainapp`, and Nginx with the latest configurations.
    
    Bash
    
    ```
    sudo docker compose up -d
    ```
    

* * *

#### **Part 3: Final Testing**

1.  **Access your site in a web browser:**
    
    - `https://wade-usa.com` (Your React Frontend)
    - `https://api.wade-usa.com` (Your Directus API/Admin Interface)
2.  **Complete Directus Initial Setup:** If prompted, complete the Directus admin setup using the credentials from your `.env` file.
    
3.  **Test your application's functionality:**
    
    - User Registration
    - User Login
    - Navigation to various pages
    - Test your custom 404 page by visiting a non-existent URL (e.g., `https://wade-usa.com/non-existent-page`).

* * *