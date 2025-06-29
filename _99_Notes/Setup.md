## Wade-USA.com: The Official Project Setup

This is the blueprint of our digital creation. A quick reference for the tools and a map of the land we are building on.

- **Project:** `wade-usa.com` Monorepo
    
- **Domain:** `wade-usa.com` (Primary), `api.wade-usa.com` (Directus API)
    
- **Server:** DigitalOcean Droplet
    
    - **IP Address:** `159.223.207.34`
        
    - **OS:** Ubuntu 24.04 (LTS) x64
        
    - **Specs:** 2 vCPUs, 2GB RAM, 25GB Disk
        
    - **Region:** SFO3
        
- **Storage:** DigitalOcean Spaces for file uploads.
    
- **Core Technologies:**
    
    - **Frontend:** React
        
    - **Backend:** Node.js
        
    - **Database:** PostgreSQL
        
    - **Headless CMS:** Directus
        
- **Build Tools:**
    
    - **Monorepo Manager:** PNPM Workspaces
        
    - **Build Runner/Orchestrator:** TurboRepo
        
    - **Frontend Bundler:** Vite
        
- **Deployment:** Docker with multiple containers (Nginx, Directus/Postgres, Site) managed by `docker compose`.