On Your Local Machine
Step 1: Make Your Code Changes

Edit any files you need to in your local project directory (e.g., adding a new component, changing CSS, etc.).

Step 2: Build the Frontend Application

After you've made your changes, you must create a new production build. From the root directory of your project (wade-usa-v3), run:

Bash

pnpm --filter @wade-usa/shell build
Step 3: Commit and Push to Git

Add all your changes to Git, commit them with a descriptive message, and push them to your remote repository.

Bash

# Add all new and modified files
git add .

# Commit the changes
git commit -m "feat: Add new feature or fix bug"

# Push to GitHub
git push origin main
On Your Server (Droplet)
Step 4: Pull the Latest Changes

SSH into your server and navigate to your project directory. Pull the changes you just pushed.

Bash

cd ~/wade-usa.com
git pull origin main
Step 5: Re-build and Deploy the Docker Container

Finally, navigate to your backend-config directory and run the docker compose up command with the --build flag. This tells Docker to rebuild your frontend image with the new files you just pulled.

Bash

cd backend-config
docker compose up -d --build
That's it. Docker will build the new frontend container with your updated code and seamlessly replace the old one. After the command finishes, your changes will be live on https://wade-usa.com.


## Troubleshooting:

```bash
docker compose down --remove-orphans
docker network prune
docker compose up -d 
```