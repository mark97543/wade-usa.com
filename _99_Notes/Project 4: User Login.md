### **Project 4: User Log in**

**Mission:** We need the user to log in then direct to a docker page for them (We need to keep in mind there will be a registration page and different level of user access).

* * *

**4.1. Authentication Flow** The authentication process is handled by the `@wade-usa/auth` package, which uses the Directus SDK. The core logic resides in `packages/auth/src/AuthContext.jsx`. The system is designed to check for an existing session on load, handle new logins and registrations, and manage user logout. Upon a successful login, the user is navigated to the `/docker` page.

- **Code Added:** `packages/auth/src/AuthContext.jsx`
    
    JavaScript
    
    ```
    import React, { createContext, useContext, useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import client from './api';
    import { login as apiLogin, logout as apiLogout, readMe, createUser } from '@directus/sdk';
    
    const AuthContext = createContext(null);
    
    export const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(null);
      const [loading, setLoading] = useState(true);
      const [authError, setAuthError] = useState(null);
      const navigate = useNavigate();
    
      useEffect(() => {
        const checkAuthSession = async () => {
          const token = localStorage.getItem('directus_token');
          if (token) {
            try {
              client.setToken(token);
              const userData = await client.request(readMe({ fields: ['*', 'role.*'] }));
              setUser(userData);
            } catch (error) {
              console.warn('Session token invalid or expired.');
              localStorage.removeItem('directus_token');
              setUser(null);
            }
          }
          setLoading(false);
        };
        checkAuthSession();
      }, []);
    
      const login = async (email, password) => {
        setAuthError(null);
        try {
          const response = await client.login(email, password);
          localStorage.setItem('directus_token', response.access_token);
          client.setToken(response.access_token);
          const userData = await client.request(readMe({ fields: ['*', 'role.*'] }));
          setUser(userData);
          return true;
        } catch (error) {
          console.error('Login failed:', error);
          setAuthError('Invalid email or password.');
          throw new Error('Invalid email or password.');
        }
      };
    
      const register = async (email, password) => {
        setAuthError(null);
        try {
          await client.request(createUser({ email, password }));
          await login(email, password);
          return true;
        } catch (error) {
          console.error('Registration failed:', error);
          setAuthError('This email may already be registered.');
          throw new Error('Registration failed.');
        }
      };
    
      const logout = async () => {
        try {
          await client.logout();
        } catch (error) {
          console.error("Logout API call failed, but clearing client-side session anyway.", error);
        } finally {
          localStorage.removeItem('directus_token');
          setUser(null);
          setAuthError(null);
          navigate('/goodbye');
        }
      };
    
      const value = { user, isLoggedIn: !!user, loading, authError, login, logout, register };
    
      return (
        <AuthContext.Provider value={value}>
          {!loading && children}
        </AuthContext.Provider>
      );
    };
    
    export const useAuth = () => {
      const context = useContext(AuthContext);
      if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
      }
      return context;
    };
    ```
    

**4.2. User Roles and Permissions** The system is set up to support different user access levels based on roles defined in Directus. New users are assigned a default role upon registration, which can be configured in the Directus project settings to require manual approval for elevated access. The `ProtectedRoute` component ensures that only authenticated users can access specific routes like `/docker`.

- **Code Added:** `packages/auth/src/ProtectedRoute.jsx`
    
    JavaScript
    
    ```
    import React from 'react';
    import { Navigate } from 'react-router-dom';
    import { useAuth } from './AuthContext.jsx';
    
    export const ProtectedRoute = ({children})=>{
        const {user, loading} = useAuth();
    
        if(loading){
            return <div>Checking authentication ...</div>
        }
    
        if(!user){
            return <Navigate to='/login' replace />
        }
    
        return children
    }
    ```
    

**4.3. Docker Page** After a successful login, the user is directed to the `/docker` page, which currently serves as a placeholder. The entire backend infrastructure, including Nginx, Directus, and PostgreSQL, is containerized using Docker and defined in the `docker-compose.yml` file.

**4.4. Troubleshooting Authentication**

- **Issue: Git Permission Denied on `db_data`**
    
    - **Cause:** The Docker engine changes the permissions of the `backend-config/db_data/` directory to be owned by the `postgres` user inside the container, which denies access to your local user account.
        
    - **Solution:** Database files should never be committed to Git. The `backend-config/db_data/` directory was added to the root `.gitignore` file to resolve this.
        
- **Issue: Nginx Stuck in a Restart Loop**
    
    - **Cause:** A "chicken-and-egg" problem where Nginx fails to start because the SSL certificates it's configured to use don't exist yet. Certbot, in turn, needs Nginx running to create those certificates.
        
    - **Solution:** We adopted a multi-step process:
        
        1.  Temporarily use a minimal Nginx configuration that only listens on port 80 for the Certbot challenge.
            
        2.  Run `docker-compose up -d --force-recreate` to start the services with the minimal config.
            
        3.  Run the `docker-compose run --rm certbot` command to obtain the SSL certificates.
            
        4.  Update the Nginx configuration with the full, final SSL and proxy settings.
            
        5.  Reload the running Nginx service with `docker-compose exec nginx nginx -s reload` to apply the final configuration.
            
- **Issue: CORS (Cross-Origin Resource Sharing) Errors**
    
    - **Cause:** The browser blocks requests from the frontend (`http://localhost:5173`) to the backend (`https://api.wade-usa.com`) because the server isn't configured to allow it. We encountered several specific CORS errors, including `No 'Access-Control-Allow-Origin' header` and `multiple values` for the same header.
        
    - **Solution:** The final and correct solution was to let Directus handle CORS directly.
        
        1.  **Directus Configuration:** Added `CORS_ENABLED: "true"` and `CORS_ORIGIN: "http://localhost:5173,https://wade-usa.com,https://www.wade-usa.com"` environment variables to the `directus` service in `docker-compose.yml`.
            
        2.  **Nginx Simplification:** Removed all conflicting CORS rules from the Nginx `default.conf` file, leaving it to only proxy the requests.
            
- **Code Modified:** `backend-config/docker-compose.yml` (final version)
    
    YAML
    
    ```
    version: '3'
    
    services:
      nginx:
        image: nginx:latest
        ports:
          - "80:80"
          - "443:443"
        volumes:
          - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
          - ./certbot/www:/var/www/certbot
          - ./certbot/conf:/etc/letsencrypt
        restart: always
        depends_on:
          - directus
    
      directus:
        image: directus/directus:latest
        user: "1000:1000"
        env_file:
          - .env
        ports:
          - "8055:8055"
        volumes:
          - ./database:/directus/database
          - ./uploads:/directus/uploads
          - ./extensions:/directus/extensions
        environment:
          CORS_ENABLED: "true"
          CORS_ORIGIN: "http://localhost:5173,https://wade-usa.com,https://www.wade-usa.com"
          KEY: ${KEY}
          SECRET: ${SECRET}
          PUBLIC_URL: "https://api.wade-usa.com"
          DB_CLIENT: 'pg'
          DB_HOST: 'db'
          DB_PORT: '5432'
          DB_DATABASE: ${POSTGRES_DB}
          DB_USER: ${POSTGRES_USER}
          DB_PASSWORD: ${POSTGRES_PASSWORD}
          ADMIN_EMAIL: ${ADMIN_EMAIL}
          ADMIN_PASSWORD: ${ADMIN_PASSWORD}
        depends_on:
          - db
        restart: always
    
      db:
        image: postgres:15-alpine
        volumes:
          - ./db_data:/var/lib/postgresql/data
        environment:
          POSTGRES_DB: ${POSTGRES_DB}
          POSTGRES_USER: ${POSTGRES_USER}
          POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
        restart: always
    
      certbot:
        image: certbot/certbot
        volumes:
          - ./certbot/www:/var/www/certbot
          - ./certbot/conf:/etc/letsencrypt
    ```
    
- **Code Modified:** `backend-config/nginx/default.conf` (final version)
    
    Nginx
    
    ```
    server {
        listen 80;
        server_name api.wade-usa.com;
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        location / {
            return 301 https://$host$request_uri;
        }
    }
    
    server {
        listen 443 ssl http2;
        server_name api.wade-usa.com;
        client_max_body_size 100M;
    
        ssl_certificate /etc/letsencrypt/live/api.wade-usa.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/api.wade-usa.com/privkey.pem;
        include /etc/letsencrypt/options-ssl-nginx.conf;
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    
        location / {
            proxy_pass http://directus:8055;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
    ```