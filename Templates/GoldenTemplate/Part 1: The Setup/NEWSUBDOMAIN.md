- # Guide: Creating a New Subdomain Application (e.g., NEWSITE)

  **Goal:** Create a new, isolated React application (`newsite.wade-usa.com`) by cloning the **Golden Template** (`frontend-main`) and updating the Docker orchestration. **Prerequisites:** Phase 4.2 must be complete. All work here should be committed to the monorepo root.

  ## Phase 1: Local Setup & Code Cloning

  This phase creates the new application folder (`frontend-newsite`).

  ### 1. Copy the Golden Template

  You must be in the root of your local monorepo (`~/Documents/wade-usa.com/`).

  ```
  # 1. Navigate to the services directory
  cd services
  
  # 2. Copy the entire 'frontend-main' application structure
  # This clones the Dockerfile, Nginx config, Authentication, and UI components.
  cp -r frontend-main frontend-newsite
  
  # 3. Navigate back to the monorepo root
  cd ../..
  ```

  ### 2. Configure the New Application

  Update the identity of the new application and start building new pages.

  - **File: `services/frontend-newsite/package.json`**
    - Update the `"name"` field to `frontend-newsite` (e.g., `"name": "frontend-newsite"`).
  - **File: `services/frontend-newsite/src/App.tsx`**
    - Start building the new application pages (e.g., create a new component called `<NewsiteHome />` and replace the current routing logic).
    - *Note: All authentication and theme logic are automatically inherited.*

  ## Phase 2: Orchestration Updates

  You must update the configuration files in the monorepo root to define the new service and routing.

  ### 1. Update `docker-compose.yml`

  Add the new service definition directly after the `frontend-main` service.

  - **Action:** Open your root `docker-compose.yml` file.

  ```
    # --- NEW SERVICE: Newsite Application ---
    frontend-newsite:
      container_name: wade_frontend_newsite
      build:
        context: ./services/frontend-newsite  # Points to the new folder
        dockerfile: Dockerfile
        args:
          VITE_API_URL: ${VITE_API_URL} 
      restart: always
      networks:
        - internal_net
      expose:
        - 80 
      depends_on:
        - directus # Ensure backend is running before trying to fetch data
      deploy:
        resources:
          limits:
            memory: 256M # Keep the Nginx server small
  ```

  ### 2. Update `Caddyfile`

  Add a new route definition for the subdomain.

  - **Action:** Open your root `Caddyfile` file.

  ```
  # 4. NEWSITE Subdomain
  newsite.wade-usa.com {
      # CRITICAL: Route to the new Docker service name
      reverse_proxy frontend-newsite:80
  }
  ```

  ### 3. Commit Local Changes

  Commit the structural changes and new files to your repository.

  ```
  cd ~/Documents/wade-usa.com
  git add services/frontend-newsite docker-compose.yml Caddyfile
  git commit -m "feat: Added frontend-newsite service and Caddy routing for newsite.wade-usa.com"
  git push origin main
  ```

  ## Phase 3: Deployment & Verification

  ### 1. Update DNS Records (CRUCIAL)

  The Internet needs to know your Droplet hosts this new domain.

  - **Action:** Go to your DNS provider (where you manage `wade-usa.com`).
  - **Create a new A Record:**
    - **Type:** `A`
    - **Host/Name:** `newsite`
    - **Value/IP:** `138.68.228.190` (Your Droplet IP)

  ### 2. Deploy to Server

  Wait 5-10 minutes for DNS propagation, then SSH into your Droplet to deploy.

  ```
  # On the Server (ssh wade@138.68.228.190)
  cd /opt/wade-usa
  git pull origin main
  
  # Build and run ONLY the new service. 
  # This command is efficient as it uses Docker's cache for existing images.
  docker compose --env-file .env.production up -d --build frontend-newsite
  ```

  ### 3. Final Verification

  - Visit `https://newsite.wade-usa.com/`
  - **Expected Result:** The new application loads, and Caddy automatically provisions the SSL certificate.

  ## Phase 4: Local Testing & Validation

  Before deploying, test the new site locally alongside your other apps using Docker.

  ### 1. Update Local Override Config

  To see the new site on your laptop, you must map it to a port (e.g., `3002`).

  - **Action:** Open/Create `docker-compose.override.yml` (This file is Git-ignored).

  ```
  services:
    # Map existing apps
    frontend-main:
      ports:
        - "3000:80"
  
    # --- MAP NEW SITE ---
    frontend-newsite:
      ports:
        - "3002:80" # Access at http://localhost:3002
  ```

  Make sure to update the local vite page

  

  ### 2. Run the Local Fleet

  Spin up the entire stack (or just the new service) locally.
  
  **Option A: Run Everything**

  ```
  docker compose up -d --build
  ```
  
  **Option B: Run Only the New App (Faster)**

  ```
  docker compose up -d --build frontend-newsite
  ```
  
  ### 3. Verify in Browser

  1. Open `http://localhost:3002`.
  2. **Test Auth:** Try logging in. (Note: It uses the LIVE database, so use real credentials).
  3. **Test Theme:** Verify the colors match the Global Theme settings.

  ### 4. Cleanup (Optional)
  
  When finished testing, you can stop the containers to save battery/RAM.
  
  ```
  # Stop all containers
  docker compose down
  
  # Stop just the new one
  docker compose stop frontend-newsite
  ```
