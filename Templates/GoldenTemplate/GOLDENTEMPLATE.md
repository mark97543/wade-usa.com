# Golden Template Recreation Guide (Project Wade-Usa.com)

Version: 1.5 (Complete with Build Configs & Types)

Purpose: Recreate the secure, themed, authenticated Modular Monolith stack from scratch.

Target IP: 138.68.228.190 (Replace with new IP if rebuilding)

Monorepo Root (Server): /opt/wade-usa

## Phase 1: Infrastructure Foundation & Security

This phase secures the Ubuntu Droplet and prepares the environment for Docker.

### 1. Server Setup (Via DigitalOcean Console)

| **Action**               | **Command (Run as root)**                                    | **Notes**                                           |
| ------------------------ | ------------------------------------------------------------ | --------------------------------------------------- |
| **User Setup**           | `adduser wade` / `usermod -aG sudo wade`                     | Create and grant privileges to the non-root user.   |
| **Swap File (CRITICAL)** | `fallocate -l 4G /swapfile` / `mkswap /swapfile` / `swapon /swapfile` | Prevents Postgres/Directus OOM errors.              |
| **SSH Key Setup**        | *Manually paste local public key into* `/home/wade/.ssh/authorized_keys` | Ensure you have local SSH access before proceeding. |
| **Firewall (UFW)**       | `ufw allow ssh` / `ufw allow 80/tcp` / `ufw allow 443/tcp`   | Open only necessary ports.                          |
| **SSH Lockdown**         | *Edit* `/etc/ssh/sshd_config` and set `PermitRootLogin no` and `PasswordAuthentication no`. | Final security hardening.                           |

### 2. Docker Installation

The project uses a single-repository, single-server structure. The root directory is structured as follows:

| **Action**             | **Commands (Run as wade)**                                   | **Notes**                                                    |
| ---------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **Docker Engine**      | *Follow standard Ubuntu Docker install guide.*               | Install `docker-ce`, `docker-compose-plugin`, etc. **(Requires full SSH logout/login for user group fix).** |
| **Monorepo Structure** | `sudo mkdir -p /opt/wade-usa/data/postgres /opt/wade-usa/services` | Create persistent data and application service folders.      |
|                        | `sudo chown -R $USER:$USER /opt/wade-usa`                    | Grant ownership to user `wade`.                              |

## Phase 2: Backend Orchestration & Database Fixes

This phase sets up the database, CMS, and reverse proxy.

| **Action**           | **Location**                                                 | **Reference**                                                |
| -------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **Secrets**          | `/opt/wade-usa/.env.production`                              | **Appendix A**                                               |
| **Compose**          | `/opt/wade-usa/docker-compose.yml`                           | **Appendix B**                                               |
| **Caddy**            | `/opt/wade-usa/Caddyfile`                                    | **Appendix C**                                               |
| **Initial Deploy**   | `cd /opt/wade-usa` / `docker compose --env-file .env.production up -d` | Launches the Postgres/Directus/Caddy stack.                  |
| **Database Reset**   | `docker compose --env-file .env.production down` / `sudo rm -rf ./data/postgres/*` / `docker compose --env-file .env.production up -d` | Executes if Directus crashes on first launch.                |
| **Public Login Fix** | Run SQL command in Postgres container.                       | **Appendix G** (Crucial if login gives 401/Invalid Credentials despite correct password). |

## Phase 3: Frontend Template Logic (Local Development)

This phase creates the core reusable template logic on your **Local Computer**.

### 1. Template Setup

| **Action**       | **Commands (Run Locally)**                                   | **Notes**                                                    |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **Initialize**   | `npm create vite@latest Templates/wade-vite-template -- --template react-ts` | Creates the project in a temporary template folder.          |
| **Dependencies** | `npm install react-router-dom @directus/sdk @types/node`     | Core packages installed.                                     |
| **Config**       | Update `vite.config.ts` and `tsconfig.app.json`              | **Appendix I** (Crucial for path aliases `@/` and env vars). |

### 2. Theming & Authentication Logic

| **File**                                 | **Action**            | **Reference**                                      |
| ---------------------------------------- | --------------------- | -------------------------------------------------- |
| `src/lib/directus.ts`                    | Client Initialization | **Appendix F** (Handles credentials/cookies)       |
| `src/context/ThemeContext.tsx`           | Create Theme Provider | **Appendix F** (Handles Dynamic Styling)           |
| `src/context/AuthContext.tsx`            | Create Auth Provider  | **Appendix F** (Handles Login/Logout/Access Token) |
| `src/types/user.ts`                      | Create Types          | **Appendix F** (Required for TS compilation)       |
| `src/components/auth/ProtectedRoute.tsx` | Create Guard          | **Appendix F** (Handles Redirects)                 |

## Phase 4: Production Deployment

This phase restructures the local files into a monorepo, packages them, and launches the application.

### 1. Finalize Directory Structure (Crucial)

We must move the template from the `Templates/` folder to the final `services/` structure.

| **Step**                   | **Commands (Run Locally in Monorepo Root)**              | **Reason**                                           |
| -------------------------- | -------------------------------------------------------- | ---------------------------------------------------- |
| **Create Services Folder** | `mkdir -p services`                                      | Creates the container for all frontend apps.         |
| **Move Template**          | `mv Templates/wade-vite-template services/frontend-main` | Renames the template to the live service name.       |
| **Git Init**               | `git init`                                               | Initializes the repository.                          |
| **Secure Git**             | *Create `.gitignore` (See Appendix H)*                   | **CRITICAL:** Prevents committing `.env` or `/data`. |
| **Initial Commit**         | `git add .` / `git commit -m "Initial commit"`           | Locks in the structure.                              |

### 2. Final Code Preparation

| **File**                            | **Action**                                                   | **Reference**                            |
| ----------------------------------- | ------------------------------------------------------------ | ---------------------------------------- |
| `services/frontend-main/Dockerfile` | Create File                                                  | **Appendix D**                           |
| `services/frontend-main/nginx.conf` | Create File                                                  | **Appendix E**                           |
| **Server Deployment**               | `cd /opt/wade-usa` / `git pull origin main` / `docker compose --env-file .env.production up -d --build` | Final synchronization and build command. |

# APPENDIX: Required Configuration Files

### Appendix A: `.env.production` Template

*(Save this file in the monorepo root: `/opt/wade-usa/.env.production`)*

```
# --- POSTGRES DATABASE ---
POSTGRES_USER=directus_user
POSTGRES_PASSWORD=YOUR_DB_PASSWORD
POSTGRES_DB=directus_data

# --- DATABASE CONNECTION (For Directus) ---
DB_CLIENT="pg"
DB_HOST="postgres"
DB_PORT="5432"
DB_DATABASE="directus_data"
DB_USER="directus_user"
DB_PASSWORD=YOUR_DB_PASSWORD

# --- DIRECTUS CORE ---
KEY=GENERATE_UNIQUE_KEY
SECRET=GENERATE_UNIQUE_SECRET
ADMIN_EMAIL=admin@wade-usa.com
ADMIN_PASSWORD=YOUR_ADMIN_PASSWORD
PUBLIC_URL=[https://wade-usa.com](https://wade-usa.com)

# --- DIRECTUS SECURITY & AUTH ---
REFRESH_TOKEN_COOKIE_DOMAIN=".wade-usa.com"
REFRESH_TOKEN_COOKIE_SECURE="true"
REFRESH_TOKEN_COOKIE_SAME_SITE="Lax"

# --- VITE (Used in frontend build) ---
VITE_API_URL=[https://api.wade-usa.com](https://api.wade-usa.com)

# --- ROLE IDs (MANUALLY GET THESE FROM DIRECTUS UI) ---
VITE_ROLE_ADMIN=ADMIN_UUID
VITE_ROLE_BASIC=BASIC_UUID
VITE_ROLE_PENDING=PENDING_UUID
```

### Appendix B: `docker-compose.yml`

*(Save this file in the monorepo root: `/opt/wade-usa/docker-compose.yml`)*

```
services:
  # --- Database ---
  postgres:
    image: postgres:15-alpine
    container_name: wade_postgres
    restart: unless-stopped
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    networks:
      - internal_net

  # --- Cache (Recommended) ---
  redis:
    image: redis:7-alpine
    container_name: wade_redis
    restart: unless-stopped
    networks:
      - internal_net

  # --- Headless CMS ---
  directus:
    image: directus/directus:latest
    container_name: wade_directus
    restart: unless-stopped
    depends_on:
      - postgres
      - redis
    volumes:
      - ./data/directus-uploads:/directus/uploads
    networks:
      - internal_net
    env_file:
      - .env.production

  # --- Reverse Proxy ---
  caddy:
    image: caddy:latest
    container_name: wade_caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - ./data/caddy_data:/data
    networks:
      - internal_net

  # --- Frontend Application ---
  frontend-main:
    container_name: wade_frontend_main
    build:
      context: ./services/frontend-main
      dockerfile: Dockerfile
      args:
        VITE_API_URL: ${VITE_API_URL} 
    restart: always
    networks:
      - internal_net
    expose:
      - 80 
    depends_on:
      - directus 
```

### Appendix C: `Caddyfile`

*(Save this file in the monorepo root: `/opt/wade-usa/Caddyfile`)*

```
{
    email your-email@example.com
}

wade-usa.com {
    reverse_proxy frontend-main:80
}

api.wade-usa.com {
    reverse_proxy directus:8055
}

dashboard.wade-usa.com {
    reverse_proxy frontend-main:80
}
```

### Appendix D: Frontend `Dockerfile`

*(Save this file in the service root: `services/frontend-main/Dockerfile`)*

```
# --- Stage 1: Build Phase ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
# Inject the VITE_API_URL during the build process
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# --- Stage 2: Serve Phase (Minimal Image) ---
FROM nginx:alpine-slim
# Copy the production build assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Appendix E: Frontend `nginx.conf`

*(Save this file in the service root: `services/frontend-main/nginx.conf`)*

```
server {
    listen 80;
    server_tokens off;

    # Serve files directly from the static directory
    root /usr/share/nginx/html;
    index index.html;

    # Caching headers for security and performance
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    # CRITICAL: Handle React Router (404s should redirect to index.html)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Error handling
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

### Appendix F: Application Logic (The "Golden Template" Core)

**1. `src/types/user.ts` (Types Definition)**

```
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: { id: string; name: string; };
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, first_name: string, last_name: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (roleId: string) => boolean;
  isAdmin: boolean;
}
```

**2. `src/lib/directus.ts` (Client Config)**

```
import { createDirectus, rest, authentication } from '@directus/sdk';

// Schema and Roles constants...

export const client = createDirectus<Schema>(apiUrl)
    .with(rest({ 
        // CRITICAL: Enables cross-domain cookies (localhost -> server)
        axios: { withCredentials: true } 
    })) 
    .with(authentication('cookie', {
        autoRefresh: true,
    }));
```

**3. `src/context/AuthContext.tsx` (Login/Logout)**

```
// ... imports
export const AuthProvider = ({ children }) => {
  // ... state
  
  const login = async (email, password) => {
    // 1. Get Token
    const authResponse = await client.login(email, password);
    // 2. Set Token Manually (Fixes "first request" issue)
    client.setToken(authResponse.access_token);
    // 3. Check Session
    await checkSession();
    // 4. Clear Token (Rely on cookie hereafter)
    client.setToken(null);
  };

  const logout = async () => {
    // Manual request to ensure cookies are sent to /logout
    await client.request({
        path: '/auth/logout',
        method: 'POST',
        axios: { withCredentials: true } 
    } as any); 
    setUser(null);
  };
  // ...
};
```

**4. `src/components/auth/ProtectedRoute.tsx` (Security Guard)**

```
export const ProtectedRoute = ({ children }) => {
  const { isLoading, isAuthenticated } = useAuth(); 

  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
};
```

**5. `src/context/ThemeContext.tsx` (Theme Engine)**

```
// Uses Smart Loop to inject variables
useEffect(() => {
    async function fetchTheme() {
        const data = await client.request(readSingleton('Global_Theme'));
        if (data) {
            const root = document.documentElement;
            Object.entries(data).forEach(([key, value]) => {
                if (typeof value === 'string') {
                    const cssVarName = `--${key.replace(/_/g, '-')}`;
                    root.style.setProperty(cssVarName, value);
                }
            });
        }
    }
    fetchTheme();
}, []);
```

### Appendix G: Database Rescue Scripts

If Login fails with `INVALID_CREDENTIALS` despite correct password (Permission Error), run this on the server:

```
# Connect to DB
docker compose --env-file .env.production exec postgres psql -U directus_user -d directus_data

# Insert "Public Login" permission manually
INSERT INTO directus_permissions (collection, action, policy, fields) 
VALUES (
    'directus_users', 
    'login', 
    (SELECT id FROM directus_policies WHERE name = '$t:public_label'), 
    '*'
);
```

### Appendix H: .gitignore (Security)

*(Save this file in the monorepo root: `.gitignore`)*

```
# --- Secrets ---
.env
.env.production
.env.development
*.local

# --- Persistent Data ---
/data/
/.docker/

# --- Build Artifacts ---
node_modules/
dist/
build/
```

### Appendix I: Build Configurations

1. vite.config.ts

(Allows @/ aliases and root env loading)

```
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  // Look for .env files 2 directories up (in the monorepo root)
  envDir: path.resolve(__dirname, '../../'),
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

2. tsconfig.app.json

(Tells TypeScript about @/ aliases)

```
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
    // ... rest of config
  }
}
```
