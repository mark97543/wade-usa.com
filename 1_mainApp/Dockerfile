# Stage 1: Build the React application
FROM node:20-alpine AS build

# Set the working directory to the monorepo root inside the container's build stage.
WORKDIR /app

# Copy relevant package.json files from monorepo structure.
COPY package.json ./
COPY 1_mainApp/package.json ./1_mainApp/
COPY _components/package.json ./_components/
# This line was removed: # COPY 0_Contexts/package.json ./0_Contexts/

# Install dependencies for all workspaces from the monorepo root.
RUN npm install

# Copy the entire 1_mainApp folder (including its src and public folders).
COPY 1_mainApp/ ./1_mainApp/

# Copy the _components folder.
COPY _components/ ./_components/

# Copy the 0_Contexts folder.
COPY 0_Contexts/ ./0_Contexts/

# Change working directory to the 1_mainApp for the build command.
WORKDIR /app/1_mainApp
RUN npm run build

# Stage 2: Serve the React application with Nginx
FROM nginx:alpine

# Copy the build output from the 'build' stage.
COPY --from=build /app/1_mainApp/dist /usr/share/nginx/html

# --- CRITICAL FIX HERE: Copy the correct Nginx config for this specific app ---
# This copies the minimalist nginx.conf from your 1_mainApp directory
COPY 1_mainApp/nginx.conf /etc/nginx/conf.d/default.conf
# --- END CRITICAL FIX ---

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]