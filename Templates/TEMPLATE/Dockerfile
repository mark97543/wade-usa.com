# --- Stage 1: Build Phase ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

# --- INJECT ENVIRONMENT VARIABLES ---
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

ARG VITE_APP_MAIN_URL
ENV VITE_APP_MAIN_URL=$VITE_APP_MAIN_URL

ARG VITE_ROLE_ADMIN
ENV VITE_ROLE_ADMIN=$VITE_ROLE_ADMIN

ARG VITE_ROLE_BASIC
ENV VITE_ROLE_BASIC=$VITE_ROLE_BASIC

ARG VITE_ROLE_PENDING
ENV VITE_ROLE_PENDING=$VITE_ROLE_PENDING

ARG VITE_APP_BUDGET_URL
ENV VITE_APP_BUDGET_URL=$VITE_APP_BUDGET_URL
# ------------------------------------

RUN npm run build

# --- Stage 2: Serve Phase (Minimal Image) ---
FROM nginx:alpine-slim
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]