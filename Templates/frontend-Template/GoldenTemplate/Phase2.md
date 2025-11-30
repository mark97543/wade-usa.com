# Phase 2: Backend Orchestration Guide

**Objective:** Deploy PostgreSQL, Directus, and Caddy using Docker Compose. **Prerequisites:** Completed Phase 1 (You are logged in via SSH as `wade`).

## Step 1: Install Docker Engine

*We need the official Docker repository for the latest version.*

1. **Remove conflicting packages (just in case):**

   ```bash
   for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done
   ```

2. **Set up Docker's apt repository:**

   ```bash
   # Add Docker's official GPG key:
   sudo apt-get update
   sudo apt-get install ca-certificates curl
   sudo install -m 0755 -d /etc/apt/keyrings
   sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
   sudo chmod a+r /etc/apt/keyrings/docker.asc
   
   # Add the repository to Apt sources:
   sudo rm /etc/apt/sources.list.d/docker.list
   echo \
     "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
     $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
     sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   sudo apt-get update
   ```

3. **Install Docker packages:**

   ```bash
   sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
   ```

4. **Add your user to the Docker group:** *This allows you to run docker without `sudo`.*

   ```bash
   sudo usermod -aG docker $USER
   ```

   **IMPORTANT:** You must log out and log back in for this to take effect.

   - Type `exit` to disconnect.
   - SSH back in: `ssh wade@...`

## Step 2: Directory Structure Setup

We will create the "Modular Monolith" folder structure at `/opt/wade-usa`.

1. **Create directories:**

   ```bash
   # Create the main folder and data subfolders
   sudo mkdir -p /opt/wade-usa/data/postgres
   sudo mkdir -p /opt/wade-usa/data/directus-uploads
   sudo mkdir -p /opt/wade-usa/data/directus-extensions
   sudo mkdir -p /opt/wade-usa/data/caddy_data
   sudo mkdir -p /opt/wade-usa/data/caddy_config
   ```

2. **Take ownership:** *Since we created these with sudo, we need to make sure the `wade` user owns them.*

   ```
   sudo chown -R $USER:$USER /opt/wade-usa
   ```

3. **Navigate to the project root:**

   ```
   cd /opt/wade-usa
   ```

## Step 3: Create Configuration Files

### A. Create the Environment File

1. Create the file:

   ```
   nano .env.production
   ```

2. **Action:** Paste the content of the `.env.production` file we generated earlier.

   - *Tip: Ensure `REFRESH_TOKEN_COOKIE_DOMAIN` is set to `.wade-usa.com`.*

3. Save and exit (`Ctrl+O`, `Enter`, `Ctrl+X`).

### B. Create the Caddyfile (Reverse Proxy)

1. Create the file:

   ```
   nano Caddyfile
   ```

2. Paste this configuration:

   ```
   {
       email your-email@example.com
   }
   
   # 1. Main Website
   wade-usa.com {
       reverse_proxy frontend:80
   }
   
   # 2. Directus API & Admin
   api.wade-usa.com {
       reverse_proxy directus:8055
   }
   
   # 3. Future Dashboard Subdomain
   dashboard.wade-usa.com {
       reverse_proxy frontend-dashboard:80
   }
   ```

3. **Note:** Replace `your-email@example.com` with your actual email (for Let's Encrypt SSL notifications).

4. Save and exit.

## Step 4: Create Docker Compose

1. Create the file:

   ```
   nano docker-compose.yml
   ```

2. Paste the following orchestration config:

   ```
   services:
     # --- Database ---
     postgres:
       image: postgres:15-alpine
       container_name: wade_postgres
       restart: unless-stopped
       volumes:
         - ./data/postgres:/var/lib/postgresql/data
       environment:
         POSTGRES_USER: ${POSTGRES_USER}
         POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
         POSTGRES_DB: ${POSTGRES_DB}
       networks:
         - internal_net
       # Limit memory usage
       deploy:
         resources:
           limits:
             memory: 512M
   
     # --- Cache (Optional but recommended) ---
     redis:
       image: redis:7-alpine
       container_name: wade_redis
       restart: unless-stopped
       networks:
         - internal_net
       deploy:
         resources:
           limits:
             memory: 128M
   
     # --- Headless CMS ---
     directus:
       image: directus/directus:latest
       container_name: wade_directus
       restart: unless-stopped
       depends_on:
         - postgres
         - redis
       volumes:
         - ./data/directus-uploads:/directus/uploads
         - ./data/directus-extensions:/directus/extensions
       networks:
         - internal_net
       # Using the env file passed in command line
       env_file:
         - .env.production
       deploy:
         resources:
           limits:
             memory: 1024M
   
     # --- Reverse Proxy ---
     caddy:
       image: caddy:latest
       container_name: wade_caddy
       restart: unless-stopped
       ports:
         - "80:80"
         - "443:443"
       volumes:
         - ./Caddyfile:/etc/caddy/Caddyfile
         - ./data/caddy_data:/data
         - ./data/caddy_config:/config
       networks:
         - internal_net
   
   networks:
     internal_net:
       driver: bridge
   ```

3. Save and exit.

## Step 5: Boot and Verify

1. **Launch the stack:** *We must specify the env file explicitly.*

   ```
   docker compose --env-file .env.production up -d
   ```

2. **Check status:**

   ```
   docker compose ps
   ```

   *All columns should say "Up".*

3. **Verify Logs (Debug):** If something isn't working, check the logs of a specific service:

   ```
   docker compose logs -f directus
   ```

4. **Browser Test:** Visit `https://api.wade-usa.com`. You should see the Directus Login screen. *(Note: Use the ADMIN_EMAIL and ADMIN_PASSWORD from your .env file to log in).*
