- - - # Project Plan: Wade-Usa.com

      **Version:** 2.2 (Phase 3 Complete / Ready for Deployment) **Architecture:** Modular Monolith (Single Server) **Infrastructure:** DigitalOcean Droplet (2GB RAM / 25GB Disk) **IP Address:** 138.68.228.190 **OS:** Ubuntu 24.04 LTS

      ## 1. Architecture Overview

      - **Core Principle:** Single Repository, Single Server, Dockerized Services.
      - **Reverse Proxy:** Caddy (Handles SSL automation and subdomain routing).
      - **Database:** PostgreSQL (Shared backend for Directus).
      - **Backend:** Directus (Headless CMS for data modeling and API).
      - **Frontend:** React + Vite (Multiple apps served via subdomains).

      ## 2. Infrastructure Strategy

      - **Resource Management:** Strict Docker memory limits and Swap file (4GB) to prevent OOM errors on 2GB RAM.
      - **Deployment:** Docker Compose for orchestration.
      - **Assets:** Local storage mapped to Docker volumes (eventual migration to S3).
      - **Configuration Management:**
        - **Root Directory:** Must contain exactly two environment files:
          1. `.env.production` (Live credentials, strict CORS, Secure Cookies).
          2. `.env.development` (Localhost credentials, open CORS, Insecure Cookies).
        - **Execution:** Deployment commands must explicitly target the environment file (e.g., `docker compose --env-file .env.production up -d`).

      ## 3. Phased Execution Plan

      ### Phase 1: Infrastructure Foundation & Security

      **Status:** ✅ Complete

      ### Phase 2: Backend Orchestration

      **Status:** ✅ Complete

      ### Phase 3.1: Frontend Template Creation

      **Status:** ✅ Complete

      - **Objective:** Build a reusable React + TS + CSS starter kit.
      - **Action Items:**
        - [x] **Local Init:** Create `wade-vite-template` locally.
        - [x] **Clean Slate:** Remove default Vite styling/assets.
        - [x] **Dependencies:** Install `react-router-dom` and `@directus/sdk`.
        - [x] **Configuration:** Setup `vite.config.ts` for path aliases (`@/`).
        - [x] **SDK Setup:** Create a typed Directus client instance.

      ### Phase 3.2: Theming & Scaffolding

      **Status:** ✅ Complete

      - **Objective:** Connect the Frontend to the Backend CMS.
      - **Action Items:**
        - [x] **CMS Data:** Create `Global_Theme` collection in Directus (Colors, Fonts, Logo).
        - [x] **React Context:** Build `ThemeProvider.tsx` to fetch settings on load.
        - [x] **CSS Variables:** Inject CMS data into `:root` CSS variables.

      ### Phase 3.3: UI Component Library

      **Status:** ✅ Complete

      - **Objective:** Build reusable, themed components (The "Lego Blocks").
      - **Action Items:**
        - [x] **Atoms:** Create `<Button />`, `<Input />`, `<Spinner />`.
        - [x] **Molecules:** Create `<FormGroup />`, `<Card />`, `<Alert />`.
        - [x] **Layouts:** Create `<AuthLayout />`.
        - [x] **Verification:** Build "Kitchen Sink" page in `App.tsx` to verify theming.

      ### Phase 3.4: Authentication Implementation

      **Status:** ✅ Complete

      - **Objective:** Secure the app with Cookie-based Auth.
      - **Action Items:**
        - [x] **Auth Context:** Create `AuthProvider.tsx` to manage user state.
        - [x] **Login Page:** Build `src/pages/Login.tsx` using UI components.
        - [x] **Refresh Logic:** Implement silent refresh on app load using the `httpOnly` cookie.
        - [x] **Route Guard:** Create `<ProtectedRoute>` wrapper for private pages.
      - **Outcome:** Login/Logout/Protected Routes now function correctly using secure, cross-domain cookies.

      ### Phase 4.1: Production Preparation & Code Commit

      **Status:** ✅ Complete

      - **Objective:** Prepare the code for deployment and establish version control.
      - **Action Items:**
        - [x] **Final Template Structure:** Move `wade-vite-template` to `services/frontend/` on local machine.
        - [x] **Git Init & Commit:** Initialize Git in the project root (`~/Documents/wade-usa-monorepo`).
        - [x] **Docker Build File:** Create `.gitignore` to protect secrets.

      ### Phase 4.2: Deployment & Final Routing

      **Status:** 🟡 Ready to Start

      - **Objective:** Get the React app running in a Docker container and connect it to Caddy.
      - **Action Items:**
        - [ ] **Create Dockerfile:** Build the Multi-stage `Dockerfile` inside the `services/frontend-main/` folder.
        - [ ] **Update Docker Compose:** Add the new `frontend-main` service definition.
        - [ ] **Update Caddyfile:** Route `wade-usa.com` to the new `frontend-main` service.
        - [ ] **Deployment Pull:** On the server, execute `git pull` in `/opt/wade-usa`.
        - [ ] **Production Build:** Build and deploy the entire stack on the server (`docker compose up -d --build`).
        - [ ] **Verification:** Verify the site loads securely at `https://wade-usa.com`.

      ## 4. Authentication Architecture

      **Goal:** Seamless authentication across `*.wade-usa.com`.

      ### The Mechanism

      We will use **Refresh Token Rotation** with Cookies.

      1. **Login:** React App sends credentials to `api.wade-usa.com`.
      2. **Response:**
         - JSON Body: `access_token` (Stored in React Memory/Context).
         - Set-Cookie Header: `refresh_token` (HttpOnly, Secure, Domain=.wade-usa.com).
      3. **Subdomain Switch:** User goes to `admin.wade-usa.com`. The browser automatically includes the refresh_token cookie because the domain matches.
      4. **Silent Refresh:** The new app sees no Access Token in memory, calls /auth/refresh. Directus validates the cookie and issues a new Access Token.

      ### Directus Configuration Requirements

      - `REFRESH_TOKEN_COOKIE_DOMAIN`: Must be set to `.wade-usa.com` (note the leading dot).
      - `REFRESH_TOKEN_COOKIE_SECURE`: Must be `true` in production (requires HTTPS).
      - `REFRESH_TOKEN_COOKIE_SAME_SITE`: Must be `Lax`.

      # Changelog

      ### Entry 017: Phase 4.1 Completion (Git)

      - **Date:** 2025-11-29
      - **Action:** Local repository initialized, Golden Template committed, and `.gitignore` configured to protect secrets.
      - **Outcome:** Codebase is standardized and ready to be pulled down onto the production server.

      ### Entry 016: Local Repository Established

      - **Date:** 2025-11-29
      - **Action:** Git repository initialized and code committed locally. `.gitignore` is established to protect secrets (`.env` and `/data/`).
      - **Note:** Ready to push to remote repository and begin deployment sequence.

      ### Entry 015: Phase 3 Completion & Authentication Success

      - **Date:** 2025-11-29
      - **Action:** Completed Phase 3.4 (Authentication) after debugging SDK initialization.
      - **Outcome:** The "Golden Template" is complete.

      *(... Previous Changelog Entries Omitted for Brevity ...)*
