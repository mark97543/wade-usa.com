# --- Stage 1: Build Phase ---
# Use a Node image to compile the React/TypeScript code
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json first to cache dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the remaining source code
COPY . .

# IMPORTANT: Inject the VITE_API_URL during the build process
# We pass the variable from the docker-compose.yml build args.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the project
# 'npm run build' uses Vite to create the production ready bundle in the 'dist' folder
RUN npm run build

# --- Stage 2: Serve Phase (Minimal Image) ---
# Use a minimal web server (Nginx) to serve the static assets securely
FROM nginx:alpine-slim

# Copy the production build assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy a custom Nginx configuration file (we'll create this next)
# This ensures all traffic is handled by index.html (required for React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the standard HTTP port (Caddy will handle 443/SSL)
EXPOSE 80

# The Nginx image automatically starts the web server on boot.
CMD ["nginx", "-g", "daemon off;"]