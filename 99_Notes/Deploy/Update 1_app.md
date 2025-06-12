### **Site Update Workflow**

This process assumes you've made your changes locally and pushed them to your GitHub repository.

1.  **Develop Locally:**
    
    - Make your desired changes to your `1_mainApp` (or any other part of your monorepo) on your local development machine.
    - Test your changes thoroughly in your local environment.
2.  **Commit and Push to GitHub:**
    
    - Once you're satisfied with your changes locally, commit them to your Git repository.
    - Push your changes to your `main` branch (or whatever branch you're deploying from) on GitHub.
    
    Bash
    
    ```
    git add .
    git commit -m "Your descriptive commit message"
    git push origin main # Replace 'main' with your branch name if different
    ```
    
3.  **Pull Latest Changes on Your Digital Ocean Droplet:**
    
    - SSH into your Droplet.
    - Navigate to your monorepo root directory (`~/wade-usa.com`).
    - Pull the latest changes from your GitHub repository.
    
    Bash
    
    ```
    ssh your_username@159.223.207.34
    cd ~/wade-usa.com
    git pull origin main # Replace 'main' with your branch name if different
    ```
    
    *If you have any local changes on the Droplet that are not in Git, `git pull` might complain. You may need to `git stash` them temporarily or `git reset --hard origin/main` (use `reset --hard` with extreme caution as it discards local changes).*
    
4.  **Rebuild Affected Docker Images on the Droplet:**
    
    - If you changed any code in `1_mainApp` (React frontend), `_components`, `0_Contexts`, or the `1_mainApp/Dockerfile` itself, you need to rebuild the `wade-usa-main-app` image.
        
    - Navigate to your monorepo root on the Droplet:Bash
        
        ```
        cd ~/wade-usa.com
        ```
        
    - Rebuild the `mainapp` image:Bash
        
        ```
        sudo docker build --no-cache -f 1_mainApp/Dockerfile -t wade-usa-main-app:latest .
        ```
        
    - If you updated Directus files directly (which is less common if you manage Directus via its UI), you might need to rebuild the `directus_app` image, but generally, Directus updates are handled differently (e.g., pulling a new image version). For most content/config changes via Directus UI, a rebuild isn't needed.
        
5.  **Restart Docker Compose Services on the Droplet:**
    
    - To apply the changes from your new Docker images or any updated `docker-compose.yml` or `nginx/nginx.conf` files, restart your services.
        
    - Navigate to your monorepo root on the Droplet:Bash
        
        ```
        cd ~/wade-usa.com
        ```
        
    - Stop and remove existing containers, then bring them back up detached:Bash
        
        ```
        sudo docker compose down
        sudo docker compose up -d
        ```
        
    
    *If you only changed `nginx/nginx.conf`, you could just restart the Nginx service for a quicker update without taking down other services: `sudo docker compose restart nginx_proxy`.*
    
6.  **Verify the Update:**
    
    - Open your web browser and navigate to `https://wade-usa.com` to confirm your changes are live.
        
    - If any issues arise, check the logs of the relevant containers:Bash
        
        ```
        sudo docker compose ps
        sudo docker compose logs [service_name] # e.g., mainapp, nginx_proxy, directus_app
        ```
        

This process ensures that your latest code is pulled to the server, incorporated into your Docker images, and then deployed to your live site, all while maintaining the integrity of your Dockerized environment.