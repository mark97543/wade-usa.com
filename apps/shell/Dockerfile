# ===============================================================
# Stage 1: The "Build" Stage
# ===============================================================
# We start with a Node.js image to build our React app
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the root package.json and pnpm-lock.yaml to install dependencies
COPY ../../package.json ../../pnpm-lock.yaml ./
# This is a pnpm-specific step for workspaces
COPY ../../pnpm-workspace.yaml ./

# Copy the source code of all our packages
COPY ../../packages /app/packages
COPY ../../apps/shell /app/apps/shell

# Install all dependencies using pnpm
RUN npm install -g pnpm
RUN pnpm install

# Run the production build command for the shell app
RUN pnpm --filter @wade-usa/shell build

# ===============================================================
# Stage 2: The "Serve" Stage
# ===============================================================
# Now, we start with a very lightweight Nginx image to serve the files
FROM nginx:stable-alpine

# Copy the built files from the "builder" stage into the Nginx webroot
COPY --from=builder /app/apps/shell/dist /usr/share/nginx/html

# Copy our custom Nginx configuration
# We will create this file next. It tells Nginx how to handle React Router.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80

# Start the Nginx server when the container launches
CMD ["nginx", "-g", "daemon off;"]

# Copy our custom Nginx configuration from the correct path
# relative to the build context (the project root)
COPY apps/shell/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80

# Start the Nginx server when the container launches
CMD ["nginx", "-g", "daemon off;"]