#### **Phase 1: Create the New App (Local Machine)**

This phase focuses on setting up your new `1_travel` React application locally, including its basic Docker and internal Nginx configurations.

1.  **Create the `1_travel` Application Directory:** On your **local development machine**, navigate to your monorepo root (`~/wade-usa.com/`) and create the new app directory.
    
    Bash
    
    ```
    cd ~/wade-usa.com
    mkdir 1_travel
    cd 1_travel
    ```
    
2.  **Initialize React App (e.g., with Vite):** You would typically initialize a new React project here. For example, using Vite:
    
    Bash
    
    ```
    npm create vite@latest . -- --template react
    ```
    
    Follow the prompts. This will create your `package.json`, `src` directory, `index.html`, etc., for `1_travel`.
    
3.  **Install Local Dependencies for `1_travel`:** After initialization, install the basic dependencies for your `1_travel` app.
    
    Bash
    
    ```
    npm install
    ```
    
4.  **Copy and Adapt `Dockerfile` for `1_travel`:** Copy the `Dockerfile` from `1_mainApp` as a starting point.
    
    Bash
    
    ```
    cp ../1_mainApp/Dockerfile ./Dockerfile
    ```
    
    Now, open `~/wade-usa.com/1_travel/Dockerfile` and replace its content with the following. Pay close attention to the `1_travel` specific paths.
    
    Dockerfile
    
    ```
    # Stage 1: Build the React application
    FROM node:20-alpine AS build
    
    # Set the working directory to the monorepo root inside the container's build stage.
    WORKDIR /app
    
    # Copy relevant package.json files from monorepo structure.
    COPY package.json ./
    # --- Adapt for 1_travel: ---
    COPY 1_travel/package.json ./1_travel/
    # Shared components/contexts should still be copied
    COPY _components/package.json ./_components/
    # If 0_Contexts has a package.json for its own dependencies, keep this, otherwise remove:
    # COPY 0_Contexts/package.json ./0_Contexts/
    
    # Install dependencies for all workspaces from the monorepo root.
    RUN npm install
    
    # Copy the entire 1_travel folder (including its src and public folders).
    # --- Adapt for 1_travel: ---
    COPY 1_travel/ ./1_travel/
    
    # Copy the _components folder.
    COPY _components/ ./_components/
    
    # Copy the 0_Contexts folder.
    COPY 0_Contexts/ ./0_Contexts/
    
    # Change working directory to the 1_travel for the build command.
    # --- Adapt for 1_travel: ---
    WORKDIR /app/1_travel
    RUN npm run build
    
    # Stage 2: Serve the React application with Nginx
    FROM nginx:alpine
    
    # Copy the build output from the 'build' stage.
    # --- Adapt for 1_travel: ---
    COPY --from=build /app/1_travel/dist /usr/share/nginx/html
    
    # Copy the correct Nginx config for this specific app (from 1_travel directory)
    # --- Adapt for 1_travel: ---
    COPY 1_travel/nginx.conf /etc/nginx/conf.d/default.conf
    
    EXPOSE 80
    CMD ["nginx", "-g", "daemon off;"]
    ```
    
5.  **Copy Internal `nginx.conf` for `1_travel`:** Copy the minimalist `nginx.conf` that will be specific to your `1_travel` app's internal Nginx server.
    
    Bash
    
    ```
    cp ../1_mainApp/nginx.conf ./nginx.conf
    ```
    
    The content of `~/wade-usa.com/1_travel/nginx.conf` should be:
    
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
    
    (No changes are typically needed to this file's content.)
    
6.  **Adapt `vite.config.js` for `1_travel` (if it uses aliases):** If your `1_travel` app uses `vite.config.js` and needs aliases for `_components` or `0_Contexts` (similar to `1_mainApp`), ensure they are correctly set up. A common setup is to point them one level up to the monorepo root. For example:
    
    JavaScript
    
    ```
    // In ~/wade-usa.com/1_travel/vite.config.js
    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';
    import path from 'path';
    
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    
    export default defineConfig({
      plugins: [react()],
      resolve: {
        alias: {
          '@components': path.resolve(__dirname, '../_components'),
          '@contexts': path.resolve(__dirname, '../0_Contexts'),
          // If you use react-router-dom in 1_travel, add this alias as well
          'react-router-dom': path.resolve(__dirname, '../node_modules/react-router-dom/dist/index.js'),
        },
      },
      // ... other Vite configs
    });
    ```
    
7.  **Add `1_travel` to Monorepo Workspaces:** Edit your main `~/wade-usa.com/package.json` to include `1_travel` in the `workspaces` array:
    
    JSON
    
    ```
    // In ~/wade-usa.com/package.json
    {
      "name": "wade-usa.com",
      // ...
      "workspaces": [
        "1_mainApp",
        "0_Contexts",
        "1_travel" // <--- ADD THIS LINE
      ],
      // ...
    }
    ```
    
8.  **Install Root Dependencies:** After adding `1_travel` to workspaces, run `npm install` from the monorepo root to link its dependencies.
    
    Bash
    
    ```
    cd ~/wade-usa.com
    npm install
    ```