# Engineering Note: Persistent Local Authentication (Hosts File Strategy)

### 1. The Problem: "The Localhost Cookie Gap"

When developing locally, authentication often fails to persist after a page refresh. This happens because of modern browser security policies regarding **Cross-Domain Cookies**.

- **Production Setup:** Your API (`api.wade-usa.com`) sets an `HttpOnly` cookie with the `Domain` attribute set to `.wade-usa.com`.
- **The Conflict:** Browsers strictly enforce domain matching. `localhost` is **not** a subdomain of `wade-usa.com`. Therefore, the browser rejects the session cookie sent by the API.
- **The Result:** You log in successfully (receive token), but as soon as you refresh or navigate, the cookie is gone, and you are logged out.

### 2. The Solution: DNS Spoofing

We bypass this by "tricking" the local computer into believing it *is* a valid subdomain of the production site. We map a custom domain (e.g., `dev.wade-usa.com`) to the local loopback IP address (`127.0.0.1`).

**Why this works:**

1. You access the app at `http://dev.wade-usa.com:3000`.
2. The API sends a cookie for `.wade-usa.com`.
3. The browser sees that `dev.wade-usa.com` matches the cookie domain scope.
4. **Success:** The browser accepts and saves the cookie, enabling persistent sessions.

------

### 3. Implementation Steps

#### Step A: Modify the Hosts File

This file overrides DNS lookups on your specific machine.

**For Mac / Linux:**

1. Open Terminal.
2. Run: `sudo nano /etc/hosts`
3. Add the mapping line (see below).
4. Save (`Ctrl+O`, `Enter`) and Exit (`Ctrl+X`).

**For Windows:**

1. Open **Notepad** as Administrator (Right-click > Run as Admin).
2. Open file: `C:\Windows\System32\drivers\etc\hosts`
3. Add the mapping line.

**The Mapping Line:**

Plaintext

```
127.0.0.1  dev.wade-usa.com
```

#### Step B: Update Server CORS (Crucial)

Your Directus server is configured to block unknown origins. You must whitelist your new "fake" domain.

1. SSH into server: `ssh wade@138.68.228.190`

2. Edit env: `nano /opt/wade-usa/.env.production`

3. Update `CORS_ORIGIN` to include your new local URL (with port):

   Bash

   ```
   CORS_ORIGIN="https://wade-usa.com,...,http://localhost:3000,http://dev.wade-usa.com:3000"
   ```

4. Restart Directus: `docker compose --env-file .env.production up -d --force-recreate directus`

#### Step C: Workflow Usage

1. Start your frontend normally (`npm run dev`).
2. **Do not** go to `localhost:3000`.
3. **Instead, go to:** `http://dev.wade-usa.com:3000`

### 4. Summary of Benefits

| **Method**                | **Pros**                                      | **Cons**                                          |
| ------------------------- | --------------------------------------------- | ------------------------------------------------- |
| **Using Localhost**       | Zero setup.                                   | Cookies fail. Auth doesn't persist.               |
| **Mock User (Code)**      | Easy to toggle.                               | Dangerous (security risk if deployed). Fake data. |
| **Hosts File (This Fix)** | **Production-parity.** Real API data. Secure. | Requires 1-time OS config. Requires CORS update.  |

===================



Second Try



### **Phase 1: Configure Local DNS (Linux)**

1. Open your terminal.

2. Edit your hosts file using `sudo`:

   Bash

   ```
   sudo nano /etc/hosts
   ```

3. Scroll to the bottom and add this line:

   Plaintext

   ```
   127.0.0.1  dev.wade-usa.com
   ```

4. **Save & Exit**: Press `Ctrl+O`, `Enter`, then `Ctrl+X`.

### **Phase 2: Whitelist the Domain (Server-Side)**

You must tell the live Directus server to accept requests from this new "fake" domain.

1. SSH into your server:

   Bash

   ```
   ssh wade@159.223.207.34
   ```

2. Edit the production environment file:

   Bash

   ```
   nano /opt/wade-usa/.env.production
   ```

3. Find `CORS_ORIGIN` and append your new local URL (including the port):

   Bash

   ```
   # Append: ,http://dev.wade-usa.com:3000
   CORS_ORIGIN="https://wade-usa.com,...,http://localhost:3000,http://dev.wade-usa.com:3000"
   ```

4. Restart Directus to apply the change:

   Bash

   ```
   docker compose --env-file .env.production up -d --force-recreate directus
   ```

5. Exit SSH.

### **Phase 3: Force Vite to Port 3000 (Local)**

Vite usually randomizes ports or defaults to 5173. You need it to stick to **3000** to match your CORS whitelist.

1. Open `services/main/vite.config.ts`.
2. Add the `server` block to the config object:

TypeScript

```
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  envDir: path.resolve(__dirname, '../../'),
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // --- ADD THIS BLOCK ---
  server: {
    port: 3000,          // Force Port 3000
    host: '127.0.0.1',   // Bind to local loopback
    allowedHosts: ['dev.wade-usa.com'] // Allow the spoofed domain
  }
})
```

### **Phase 4: Launch**

1. Start your app:

   Bash

   ```
   npm run dev
   ```

2. **Open Browser:** Go to **http://dev.wade-usa.com:3000**.

**Result:** Your browser will treat the site as a trusted subdomain, the cookie will save, and your login will persist.
