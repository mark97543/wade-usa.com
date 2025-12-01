1. - # Guide: Universal Linking Strategy (Local vs. Production)

     **Objective:** Create a unified linking system that automatically adjusts URLs depending on whether the code is running on `localhost` (Port-based) or Production (Subdomain-based). **Context:** Modular Monolith Architecture (Multiple React Apps).

     ## 1. The Core Concept

     We have two types of navigation in this architecture:

     1. **Internal Navigation (Same App):**
        - **Use Case:** Moving from `/login` to `/profile` within `frontend-main`.
        - **Tool:** `react-router-dom` (`<Link>`, `<NavLink>`, `useNavigate`).
        - **Behavior:** Instant, no page reload. Shared state is preserved.
     2. **Cross-App Navigation (Different Apps):**
        - **Use Case:** Moving from **Main Site** (`wade-usa.com`) to **Dashboard** (`dashboard.wade-usa.com`).
        - **Tool:** Standard HTML Anchor (`<a href="...">`).
        - **Behavior:** Full page load. Loads the new React App from scratch.
        - **Session:** User stays logged in because the Cookie is scoped to `.wade-usa.com`.

     ## 2. The Implementation Steps

     ### Step 1: Define Environment Variables (The "Switch")

     We use `VITE_` variables to store the base URLs. These values change depending on the environment file used.

     **A. Local Development (`.env`)** *Location: Monorepo Root on Laptop*

     ```
     # Points to Docker mapped ports
     VITE_APP_MAIN_URL=http://localhost:3000
     VITE_APP_DASHBOARD_URL=http://localhost:3001
     VITE_APP_NEWSITE_URL=http://localhost:3002
     ```

     **B. Production Server (`/opt/wade-usa/.env.production`)** *Location: Monorepo Root on Droplet*

     ```
     # Points to Live Subdomains
     VITE_APP_MAIN_URL=[https://wade-usa.com](https://wade-usa.com)
     VITE_APP_DASHBOARD_URL=[https://dashboard.wade-usa.com](https://dashboard.wade-usa.com)
     VITE_APP_NEWSITE_URL=[https://newsite.wade-usa.com](https://newsite.wade-usa.com)
     ```

     ### Step 2: Update TypeScript Definitions

     To prevent "Property does not exist" errors, we must tell TypeScript about these new variables.

     **File:** `services/frontend-main/src/vite-env.d.ts` (Repeat for each app)

     ```
     /// <reference types="vite/client" />
     
     interface ImportMetaEnv {
       readonly VITE_API_URL: string;
       // Define App URLs
       readonly VITE_APP_MAIN_URL: string;
       readonly VITE_APP_DASHBOARD_URL: string;
       readonly VITE_APP_NEWSITE_URL: string;
     }
     
     interface ImportMeta {
       readonly env: ImportMetaEnv;
     }
     ```

     ### Step 3: Implementation Patterns

     #### Pattern A: Internal Navigation (Same App)

     Use these methods when moving between pages inside the **same** subdomain (e.g., `wade-usa.com/about` to `wade-usa.com/contact`).

     **1. Standard Link (`<Link>`)** Best for standard navigation links.

     ```
     import { Link } from 'react-router-dom';
     
     export const Footer = () => (
       <footer>
         <Link to="/privacy-policy">Privacy Policy</Link>
         <Link to="/terms">Terms of Service</Link>
       </footer>
     );
     ```

     **2. Active State Link (`<NavLink>`)** Best for Sidebar or Navbar items where you want to highlight the current page.

     ```
     import { NavLink } from 'react-router-dom';
     import styles from './Navbar.module.css';
     
     export const SidebarItem = () => (
       <NavLink 
         to="/profile" 
         className={({ isActive }) => isActive ? styles.activeLink : styles.link}
       >
         My Profile
       </NavLink>
     );
     ```

     **3. Programmatic Navigation (`useNavigate`)** Best for redirects after an action (like submitting a form).

     ```
     import { useNavigate } from 'react-router-dom';
     
     export const LoginForm = () => {
       const navigate = useNavigate();
     
       const handleSubmit = async () => {
         await login();
         // Redirects user to /dashboard without page reload
         navigate('/dashboard'); 
       };
     };
     ```

     #### Pattern B: Cross-App Navigation (Different Apps)

     Use this when linking to a different subdomain/port. We import the variable instead of hardcoding the string.

     **File:** `services/frontend-main/src/components/layout/Navbar.tsx`

     ```
     import { Link } from 'react-router-dom';
     
     export const Navbar = () => {
       // 1. Grab the environment-specific URL
       const dashboardUrl = import.meta.env.VITE_APP_DASHBOARD_URL;
       const storeUrl = import.meta.env.VITE_APP_NEWSITE_URL;
     
       return (
         <nav>
           {/* Internal: Instant Transition */}
           <Link to="/about">About Us</Link>
     
           {/* External: Full Reload to new App */}
           <a href={dashboardUrl} className="external-link">
             Go to Dashboard
           </a>
           
           <a href={storeUrl} className="external-link">
             Visit Store
           </a>
         </nav>
       );
     };
     ```

     ## 3. Workflow Summary

     1. **Develop Locally:**
        - You click "Go to Dashboard".
        - Code reads `.env`.
        - Browser goes to `http://localhost:3001`.
        - **Result:** It works.
     2. **Deploy to Server:**
        - Docker builds the image using arguments from `.env.production`.
        - Code compiles with the `https://...` values baked in.
        - User clicks "Go to Dashboard".
        - Browser goes to `https://dashboard.wade-usa.com`.
        - **Result:** It works seamlessly.
