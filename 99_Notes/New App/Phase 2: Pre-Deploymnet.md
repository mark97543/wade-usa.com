#### **Phase 2: Prepare for Deployment (Configuration Changes on Droplet)**

This phase updates your Docker Compose and main Nginx proxy settings to include the new `1_travel` app.

1.  **Update `docker-compose.yml`:** Add a new service named `travelapp` to your `~/wade-usa.com/docker-compose.yml` on your local machine.
    
    YAML
    
    ```
    # In ~/wade-usa.com/docker-compose.yml
    version: '3.8'
    
    services:
      # ... (your existing postgres_db, directus_app, mainapp services) ...
    
      # --- NEW SERVICE: Your Travel App Frontend (1_travel) ---
      travelapp:
        image: wade-usa-travel-app:latest # The image you will build for travel app
        container_name: wade_usa_travel_app
        restart: always
        environment:
          VITE_APP_API_URL: https://api.wade-usa.com # If it connects to your existing API
          # Add any other specific env vars for your travel app or Strapi connection
          # For example, if Strapi is a separate service for travel blog:
          # VITE_STRAPI_API_URL: https://travel-api.wade-usa.com
        networks:
          - my_custom_network
        depends_on:
          - directus_app # If it relies on Directus
          # - strapi_app # If you introduce a separate Strapi instance for travel
    
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
        depends_on:
          - directus_app
          - mainapp
          - travelapp # <--- ADD THIS DEPENDENCY
        networks:
          - my_custom_network
    
    volumes:
      postgres_data:
      directus_data:
    
    networks:
      my_custom_network:
    ```
    
2.  **Update `nginx/nginx.conf`:** You need to add a new `server` block to your main `~/wade-usa.com/nginx/nginx.conf` file on your local machine. This will handle traffic for `travel.wade-usa.com` and proxy it to your `travelapp` service.
    
    Nginx
    
    ```
    # In ~/wade-usa.com/nginx/nginx.conf
    
    # ... (previous server blocks for wade-usa.com and api.wade-usa.com) ...
    
    # HTTPS server block for travel.wade-usa.com (Your New Travel App Frontend)
    server {
        listen 443 ssl http2;
        listen [::]:443 ssl http2;
        server_name travel.wade-usa.com; # Your new subdomain
    
        # SSL Certificate paths (you'll need to generate these with Certbot for travel.wade-usa.com)
        ssl_certificate /etc/letsencrypt/live/travel.wade-usa.com/fullchain.pem; # Adjust path if needed
        ssl_certificate_key /etc/letsencrypt/live/travel.wade-usa.com/privkey.pem; # Adjust path if needed
    
        # Standard SSL settings (replicate from other server blocks)
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
            proxy_pass http://travelapp:80; # 'travelapp' is the service name in docker-compose.yml
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }
    ```
    
3.  **DNS Configuration (Outside Docker):** On your domain registrar/DNS provider, create a new **A record** for the `travel` subdomain:
    
    - **Host/Name:** `travel`
    - **Value/Points To:** `159.223.207.34` (Your Droplet's IP address)
    - Save changes. Allow time for DNS propagation.
4.  **Generate SSL Certificates for `travel.wade-usa.com` (on Droplet):** You'll need an SSL certificate for your new subdomain. This is usually done with Certbot.
    
    - SSH into your Droplet.
        
    - Stop Nginx temporarily so Certbot can use port 80 for challenges:Bash
        
        ```
        cd ~/wade-usa.com
        sudo docker compose stop nginx_proxy
        ```
        
    - Run Certbot. If you already have Certbot installed and configured for Docker, it might involve a command like:Bash
        
        ```
        sudo certbot --nginx -d travel.wade-usa.com # Or add to existing cert: certbot --nginx -d wade-usa.com -d www.wade-usa.com -d api.wade-usa.com -d travel.wade-usa.com
        ```
        
        Follow Certbot's prompts.
        
    - After successful certificate generation, restart Nginx:Bash
        
        ```
        sudo docker compose start nginx_proxy
        ```