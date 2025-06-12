# Stage 1: Build the React application
FROM node:20-alpine AS build

# Set the working directory to the monorepo root inside the container's build stage.
# This is now '/app' which corresponds to the monorepo root (wade-usa.com) in the build context.
WORKDIR /app

# Copy relevant package.json files from monorepo structure.
# These paths are now relative to the monorepo root (the build context).
COPY package.json ./
COPY 1_mainApp/package.json ./1_mainApp/
COPY _components/package.json ./_components/
# NOTE: If your 0_Contexts directory has its own package.json and needs dependencies,
# you might need to copy that too: COPY 0_Contexts/package.json ./0_Contexts/

# Install dependencies for all workspaces from the monorepo root.
# This is where npm will hoist shared dependencies.
RUN npm install

# Copy the entire 1_mainApp folder (including its src and public folders).
# This copies everything from your local 1_mainApp into /app/1_mainApp in the container.
COPY 1_mainApp/ ./1_mainApp/

# Copy the _components folder.
# This copies your shared components into /app/_components in the container.
COPY _components/ ./_components/

# --- NEWLY ADDED LINE: Copy the 0_Contexts folder ---
COPY 0_Contexts/ ./0_Contexts/
# --- END NEWLY ADDED LINE ---

# Change working directory to the 1_mainApp for the build command.
# This ensures npm run build operates in the correct project context.
WORKDIR /app/1_mainApp
RUN npm run build

# Stage 2: Serve the React application with Nginx
FROM nginx:alpine

# Copy the build output from the 'build' stage.
# The build output is now located at /app/1_mainApp/dist (because Vite builds to 'dist' by default).
COPY --from=build /app/1_mainApp/dist /usr/share/nginx/html

# Copy the custom Nginx configuration file.
# This path is relative to the monorepo root where Nginx config is located.
# Based on your file structure, this is likely in the 'nginx' folder at the monorepo root.
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80, as Nginx listens on this by default.
EXPOSE 80
# Command to run Nginx in the foreground.
CMD ["nginx", "-g", "daemon off;"]