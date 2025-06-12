### **Next Step: Deploy Main Site (`1_mainApp`) to Droplet (Option B: `git pull` for `dist`)**

**Goal:** Build your `1_mainApp` React application for production, commit the `dist` folder to Git, and then `git pull` it onto your Droplet. Configure Nginx to serve these files.

* * *

### **Phase 1: Build Your React Application for Production & Commit `dist` (Local Machine)**

1.  **Open your local terminal** (your R2-D2 machine).
    
2.  \*\*Navigate to your React project directory:\*\*Bash
    
    ```
    cd ~/Documents/wade-usa.com/1_mainApp
    ```
    
3.  **Ensure your `.env.production` file is correctly configured:**
    
    - Open `1_mainApp/.env.production`.
    - Ensure `VITE_DIRECTUS_API_URL=https://api.wade-usa.com`. This is the URL your live frontend will use to talk to Directus.
    - Save the file.
4.  \*\*Run the production build command:\*\*Bash
    
    ```
    npm run build
    ```
    
    - This will create an optimized `dist` folder within your `1_mainApp` directory.
5.  **Remove `dist` from `.gitignore` (TEMPORARILY):**
    
    - Open `~/Documents/wade-usa.com/1_mainApp/.gitignore`.
    - Find the line `dist/` (or `build/`) and **delete or comment it out** (e.g., `# dist/`). This is necessary so Git *will* track the `dist` folder.
    - Save `.gitignore`.
6.  **Commit your changes, including the `dist` folder, and push to GitHub:**
    
    - Navigate back to your monorepo root:Bash
        
        ```
        cd ~/Documents/wade-usa.com
        ```
        
    - Add all changes, including the `dist` folder:Bash
        
        ```
        git add 1_mainApp/dist
        git add 1_mainApp/.gitignore # To commit the change to .gitignore
        git commit -m "Deployment: Add production build (dist) for frontend deployment"
        git push origin main
        ```
        
    - **Important:** Immediately after pushing, you might want to **revert the change to `1_mainApp/.gitignore` locally** (uncomment `dist/`) and commit that revert. This keeps your Git history cleaner for development but still allows the `dist` to remain in the history.Bash
        
        ```
        cd ~/Documents/wade-usa.com/1_mainApp
        # Revert .gitignore
        # Then:
        cd ~/Documents/wade-usa.com
        git add 1_mainApp/.gitignore
        git commit -m "Revert: Ignored dist/ folder again after deployment push"
        git push origin main
        ```
        

* * *

### **Phase 2: Pull Built Files onto Your Droplet (on Droplet)**

Now, you'll use `git pull` on your Droplet to get the latest code, including the `dist` folder.

1.  **Access your DigitalOcean console** and log into your Droplet (`mark` user).
    
2.  \*\*Navigate to your project root:\*\*Bash
    
    ```
    cd /home/mark/wade-usa.com
    ```
    
3.  \*\*Pull the latest changes from your GitHub repository:\*\*Bash
    
    ```
    git pull origin main
    ```
    
    This will download the `1_mainApp/dist` folder into your project directory on the Droplet.
    

* * *

### **Phase 3: Configure Nginx to Serve Static Files (on Droplet)**

This step ensures Nginx points to the correct location for your React files.

1.  **Ensure you are in your project root on the Droplet:**
    
    Bash
    
    ```
    cd /home/mark/wade-usa.com
    ```
    
2.  **Edit your `nginx.conf` file:**
    
    Bash
    
    ```
    nano nginx/nginx.conf
    ```
    
3.  **Modify the HTTPS `server` block for `wade-usa.com` and `www.wade-usa.com`.**
    
    - You need to change the `root` directive to point to the `dist` folder *within your cloned repository*.
    
    Find the `location /` block:
    
    Nginx
    
    ```
        # HTTPS server block for wade-usa.com and www.wade-usa.com (React frontend)
        server {
            listen 443 ssl http2;
            listen [::]:443 ssl http2;
            server_name wade-usa.com www.wade-usa.com;
    
            # ... (SSL certificate and other SSL settings) ...
    
            location / {
                root /usr/share/nginx/html; # <-- This is the path inside the Nginx container
                index index.html index.htm;
                try_files $uri $uri/ /index.html;
            }
        }
    ```
    
    **No change needed to `nginx.conf` itself here**, as `/usr/share/nginx/html` is the internal container path that we will map in `docker-compose.yml`.
    

* * *

### **Phase 4: Update `docker-compose.yml` and Restart Nginx (on Droplet)**

We need to tell Nginx's Docker container to mount the `1_mainApp/dist` directory from *within your cloned repository* on the Droplet's host filesystem.

1.  **Navigate to your project root on the Droplet:**
    
    Bash
    
    ```
    cd /home/mark/wade-usa.com
    ```
    
2.  **Edit your `docker-compose.yml` file:**
    
    Bash
    
    ```
    nano docker-compose.yml
    ```
    
3.  **Find the `nginx_proxy` service's `volumes` section.**
    
    - Modify the mount for your built React app to point to `1_mainApp/dist`.
    
    Change this:
    
    YAML
    
    ```
                - ./1_mainApp_dist_live:/usr/share/nginx/html:ro # <-- This line will be changed
    ```
    
    To this:
    
    YAML
    
    ```
                - ./1_mainApp/dist:/usr/share/nginx/html:ro # <-- Changed to point to the git-pulled dist
    ```
    
4.  **Save the `docker-compose.yml` file and exit `nano`.**
    
5.  **Force a clean recreation of the Nginx container to apply the new volume mount and configuration.**
    
    Bash
    
    ```
    docker compose up -d --force-recreate nginx_proxy
    ```
    

* * *

### **Step 5: Verify Deployment**

1.  **Open your web browser** and navigate to:
    
    - `https://wade-usa.com`
    - `https://www.wade-usa.com`
    
    **Expected:** You should now see your deployed React application (the Vite starter page, or whatever you've built into `Home.jsx` if that's your root) live and accessible via HTTPS!