# Phase 3.1: Frontend Template Creation

**Status:** ✅ Complete **Objective:** Build a standardized, reusable React starter kit for all future Wade-USA subdomains. **Tech Stack:** React, TypeScript, Standard CSS, Vite, Directus SDK.

## 1. Initialization

We created a fresh template in the `Templates` directory to serve as the base for future apps.

```
# Location: ~/Templates/
npm create vite@latest wade-vite-template -- --template react-ts

cd wade-vite-template
npm install
```

## 2. Dependencies

We installed the core libraries needed for routing and backend communication.

```
# Routing
npm install react-router-dom

# Backend SDK
npm install @directus/sdk

# Node Types (Required for path resolution in configs)
npm install -D @types/node
```

## 3. Configuration (Crucial)

### A. Vite Config (`vite.config.ts`)

We modified the config to do two things:

1. **Path Aliases:** Allow imports using `@/` instead of `../../`.
2. **Environment Directory:** Tell Vite to look for `.env` files in the **Project Root** (two levels up), rather than inside the template folder.

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

### B. TypeScript Config (`tsconfig.app.json`)

We updated TypeScript to recognize the `@/` alias so IntelliSense works.

```
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 4. Backend Connection

We created a typed Directus client instance.

**File:** `src/lib/directus.ts`

```
import { createDirectus, rest, authentication } from '@directus/sdk';

// Schema definition (Expand this as you add collections)
interface Schema {
    global_theme: {
        id: string;
        primary_color: string;
        site_logo: string;
        font_family: string;
    };
}

// Uses the variable from the ROOT .env file
const apiUrl = import.meta.env.VITE_API_URL || '[https://api.wade-usa.com](https://api.wade-usa.com)';

export const client = createDirectus<Schema>(apiUrl)
    .with(rest())
    .with(authentication('cookie', {
        autoRefresh: true, // Handles silent refresh automatically
    }));
```

## 5. Cleanup

We stripped the default Vite boilerplate:

- Deleted `src/App.css`.
- Reset `src/index.css` to basic CSS variables.
- Simplified `src/App.tsx`.

## 6. Development Workflow Notes

- **Environment Variables:**
  - The app relies on the `.env` file located in the **Root** of your workspace (e.g., `/opt/wade-usa/.env`).
  - To see changes to `.env`, you must **restart the dev server** (`Ctrl+C` -> `npm run dev`).
- **Styling:**
  - We are using **Standard CSS** (Modules or global) instead of Tailwind.
- **Deployment:**
  - In production, the `VITE_API_URL` will be injected via Docker build args, removing the need for the physical `.env` file.
