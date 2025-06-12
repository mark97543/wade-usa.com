#### **Phase 3: Deployment (on Droplet)**

This phase pushes your local configuration changes to GitHub and deploys the new `1_travel` app to your Droplet.

1.  **Commit and Push Local Changes to GitHub:** On your **local machine**, commit and push all the `1_travel` app files, and the updated `docker-compose.yml` and `nginx/nginx.conf` to GitHub.
    
    Bash
    
    ```
    cd ~/wade-usa.com
    git add .
    git commit -m "Add 1_travel app and update docker-compose/nginx configs"
    git push origin main # Or your branch name
    ```
    
2.  **Pull Latest Changes on Your Digital Ocean Droplet:** SSH into your Droplet and pull the latest changes from GitHub.
    
    Bash
    
    ```
    ssh your_username@159.223.207.34
    cd ~/wade-usa.com
    git pull origin main # Or your branch name
    ```
    
3.  **Build the `wade-usa-travel-app` Docker Image on the Droplet:** This builds the Docker image for your new `1_travel` app.
    
    Bash
    
    ```
    sudo docker build --no-cache -f 1_travel/Dockerfile -t wade-usa-travel-app:latest .
    ```
    
4.  **Restart All Docker Compose Services on the Droplet:** This will ensure all services (including the new `travelapp`) are recreated with the latest configurations and images.
    
    Bash
    
    ```
    sudo docker compose down
    sudo docker compose up -d
    ```
    
5.  **Verify Deployment:**
    
    - Open your web browser and go to `https://travel.wade-usa.com`. You should see your new `1_travel` app.
    - Check `sudo docker compose ps` to ensure all containers are `Up`.
    - Check `sudo docker compose logs travelapp` and `sudo docker compose logs nginx_proxy` for any errors.