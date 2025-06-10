# Directus: Connecting to DigitalOcean Spaces for File Storage

**Goal:** Configure Directus on your deployed DigitalOcean Droplet to store all user-uploaded files (images, videos, documents) directly in DigitalOcean Spaces, rather than on the Droplet's local disk.

* * *

### **Overview**

By default, Directus stores uploaded files on the local filesystem of its container (which persists to a Docker volume). To leverage DigitalOcean Spaces (S3-compatible object storage) for scalability, durability, and CDN integration, we need to:

1.  Provide Directus with the necessary S3 credentials and configuration.
2.  Tell Directus to use this S3 bucket as its primary storage location.
3.  Ensure the Docker `directus_uploads` volume (for local storage) is no longer used for new uploads.

* * *

### **Prerequisites**

- You have successfully created a **DigitalOcean Space**.
- You have your **Space's Access Key** and **Secret Key**.
    - You can generate these by going to your DigitalOcean account -> API -> Tokens/Keys -> Spaces Access Keys.
- You know your **Space's Endpoint** (e.g., `sfo3.digitaloceanspaces.com`).
- You know your **Space's Region** (e.g., `sfo3`).
- You know your **Space's Bucket Name** (the name you gave your Space).
- Your Directus instance on the Droplet is up and running.

* * *

### **Step-by-Step Configuration**

#### **Phase 1: Configure Environment Variables on Droplet**

We will add the necessary S3 configuration to your Droplet's `.env` file. Directus uses environment variables to configure its storage adapters.

1.  **Access your DigitalOcean console** and log into your Droplet (`mark` user).
    
2.  **Navigate to your project root directory:**
    
    Bash
    
    ```
    cd /home/mark/wade-usa.com
    ```
    
3.  **Edit your `.env` file:**
    
    Bash
    
    ```
    nano .env
    ```
    
4.  **Add the following lines to your `.env` file.**
    
    - **Replace all placeholder values** (`YOUR_S3_ACCESS_KEY`, `YOUR_S3_SECRET_KEY`, `YOUR_S3_ENDPOINT`, `YOUR_S3_REGION`, `YOUR_S3_BUCKET_NAME`) with your actual DigitalOcean Spaces credentials.
    
    ```
    # --- Directus Spaces/S3 Configuration ---
    STORAGE_LOCATIONS=s3,local # 's3' is your Spaces driver, 'local' is Directus's default local driver
    STORAGE_DEFAULT_DRIVER=s3 # This tells Directus to use 's3' as the default for new uploads
    S3_KEY=YOUR_S3_ACCESS_KEY
    S3_SECRET=YOUR_S3_SECRET_KEY
    S3_ENDPOINT=YOUR_S3_ENDPOINT # e.g., https://sfo3.digitaloceanspaces.com
    S3_REGION=YOUR_S3_REGION # e.g., sfo3
    S3_BUCKET=YOUR_S3_BUCKET_NAME
    S3_ACL=public-read # Common for publicly accessible files like images
    S3_FORCE_PATH_STYLE=false # Set to false for standard S3/Spaces behavior
    # --- End Directus Spaces/S3 Configuration ---
    ```
    
    - **`STORAGE_LOCATIONS=s3,local`**: This defines two storage adapters that Directus knows about. `s3` is the one we're configuring for Spaces, and `local` is the built-in local storage.
    - **`STORAGE_DEFAULT_DRIVER=s3`**: This is crucial. It tells Directus that whenever a file is uploaded, it should use the `s3` adapter by default.
    - **`S3_ACL=public-read`**: This is recommended if you want the uploaded files (like images for your website) to be publicly accessible directly via their URL.
5.  **Save the file and exit `nano`.**
    

#### **Phase 2: Remove Local Uploads Volume Mount in `docker-compose.yml`**

To ensure files are *not* saved locally, we need to remove the Docker volume mount that currently provides local storage for Directus uploads.

1.  **Navigate back to your project root directory:**
    
    Bash
    
    ```
    cd /home/mark/mark/wade-usa.com
    ```
    
2.  **Edit your `docker-compose.yml` file:**
    
    Bash
    
    ```
    nano docker-compose.yml
    ```
    
3.  **Find the `directus_app` service block.**
    
4.  **Remove or comment out the `directus_uploads` volume mount.**
    
    YAML
    
    ```
        directus_app:
        # ... (other configurations) ...
        volumes:
          - directus_data:/directus/database # Keep this for Directus's internal data
          # - directus_uploads:/directus/uploads # <-- REMOVE OR COMMENT OUT THIS LINE
        # ... (rest of directus_app service) ...
    ```
    
    - **Reasoning:** By removing this line, Directus will no longer have a Docker volume mapped to `/directus/uploads` inside its container. When it tries to save files to the `local` driver (if `STORAGE_DEFAULT_DRIVER` was `local`), it would attempt to save them to an ephemeral part of the container's filesystem, which would be lost when the container is recreated. Since we set `STORAGE_DEFAULT_DRIVER=s3`, new uploads will go to Spaces.
5.  **Save the `docker-compose.yml` file and exit `nano`.**
    

#### **Phase 3: Restart Directus and Verify**

Now, we'll restart the Directus container to apply all these changes.

1.  **Navigate back to your project root:**
    
    Bash
    
    ```
    cd /home/mark/wade-usa.com
    ```
    
2.  **Force a clean recreation of the `directus_app` container:**
    
    Bash
    
    ```
    docker compose up -d --force-recreate directus_app
    ```
    
    This will ensure Directus picks up the new environment variables from `.env` and operates without the local uploads volume.
    
3.  **Verify environment variables inside the running container (optional but good practice):**
    
    Bash
    
    ```
    docker inspect wade_usa_directus_app | grep "S3_\|STORAGE_"
    ```
    
    You should see all the `STORAGE_` and `S3_` variables with their correct values listed.
    
4.  **Test a file upload via Directus Admin Panel:**
    
    - Open your browser and log into your Directus Admin Panel (`https://api.wade-usa.com/admin`).
    - Go to **Content Studio > Files**.
    - Click the "+" button to upload a new image or file.
    - After uploading, verify that the file appears in the Directus Files section.
    - **Crucially, verify the file is in your DigitalOcean Space:** Go to your DigitalOcean dashboard, navigate to your Space, and check if the uploaded file appears there.
    - **Verify it's NOT saved locally:** You can try to `docker exec -it wade_usa_directus_app sh` and then `ls -l /directus/uploads` inside the container. It should ideally be empty or show no newly uploaded files from your test.

    # Trouble Shooting

## Too Large File

**Solution: Increase Nginx's `client_max_body_size` directive.**

This directive tells Nginx how large the maximum allowed size of the client request body (e.g., an uploaded file) can be.

**Here's how to fix it:**

**Step 1: Stop the Nginx container on your Droplet.**

1.  **Open your DigitalOcean console** and log into your Droplet (`mark` user).
    
2.  \*\*Navigate to your project root:\*\*Bash
    
    ```
    cd /home/mark/wade-usa.com
    ```
    
3.  \*\*Stop and remove the Nginx container:\*\*Bash
    
    ```
    docker stop wade_usa_nginx_proxy
    docker rm wade_usa_nginx_proxy
    ```
    

**Step 2: Modify your `nginx.conf` on the Droplet to increase the `client_max_body_size`.**

1.  **Navigate to your Nginx config directory:**
    
    Bash
    
    ```
    cd /home/mark/wade-usa.com/nginx
    ```
    
2.  **Edit your `nginx.conf` file:**
    
    Bash
    
    ```
    nano nginx.conf
    ```
    
3.  **Add the `client_max_body_size` directive.** You can add it inside the `http` block (to apply to all servers) or inside individual `server` blocks. Adding it to the `http` block is generally easier if you want it to apply globally.
    
    Let's add it to the `http` block to affect all your domains. You can set it to `20M` (20 Megabytes) or `50M` (50 Megabytes), depending on your expected maximum file size. 20M is usually a good starting point for images.
    
    Nginx
    
    ```
    # /nginx/nginx.conf
    events {
        worker_connections 1024;
    }
    
    http {
        client_max_body_size 20M; # <-- ADD THIS LINE HERE (e.g., 20 Megabytes)
    
        # Redirect all HTTP traffic to HTTPS
        server {
            listen 80;
            listen [::]:80;
            server_name wade-usa.com www.wade-usa.com api.wade-usa.com;
    
            location /.well-known/acme-challenge/ {
                root /var/www/certbot;
            }
    
            return 301 https://$host$request_uri;
        }
    
        # HTTPS server block for api.wade-usa.com (Directus API and Admin)
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
            resolver 8.8.8.8 8.8.4.4 valid=300s;
            resolver_timeout 5s;
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
    
        # HTTPS server block for wade-usa.com and www.wade-usa.com (React frontend)
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
            resolver 8.8.8.8 8.8.4.4 valid=300s;
            resolver_timeout 5s;
            add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    
            location / {
                return 200 '<html><body><h1>wade-usa.com: React Frontend Coming Soon!</h1></body></html>';
            }
        }
    }
    ```
    
4.  **Save the file and exit `nano`.**
    

**Step 3: Restart the Nginx container on the Droplet.**

1.  \*\*Navigate back to your project root:\*\*Bash
    
    ```
    cd /home/mark/wade-usa.com
    ```
    
2.  \*\*Start the Nginx container:\*\*Bash
    
    ```
    docker compose up -d nginx_proxy
    ```
    
    (No need for `--force-recreate` as we stopped and removed it, `up` will create it, but `-d` is important).