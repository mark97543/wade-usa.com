# Phase 3.2: Theming & Scaffolding Guide

**Objective:** Connect the React Frontend to Directus to dynamically load theme settings (colors, fonts, logos). **Prerequisites:** Phase 3.1 completed (Template created).

## Part 1: Directus Configuration (The Backend)

We need to create the "Single Source of Truth" for your brand's style.

1. **Log in to Directus:**
   - Go to `https://api.wade-usa.com/admin`
   - Log in with your Admin credentials.
2. **Create the Collection:**
   - Go to **Settings** (Gear Icon) -> **Data Model**.
   - Click **+ Create Collection**.
   - **Name:** `Global Theme` (Key: `global_theme`).
   - **Type:** Select **"Singleton"** (This forces only one row of data).
   - **Save.**
3. **Add Fields:** Click on the new `global_theme` collection and add these fields:
   - **Text Input:** `site_name` (e.g., "Wade USA").
   - **Color:** `primary_color` (e.g., `#000000`).
   - **Color:** `secondary_color` (e.g., `#ffffff`).
   - **Dropdown:** `font_family`
     - *Choices:* `sans-serif`, `serif`, `monospace`.
   - **Image:** `site_logo` (Stores the file UUID).
4. **Set Public Permissions (Crucial):**
   - Go to **Settings** -> **Access Control** -> **Public**.
   - Find `Global Theme`.
   - Click the **Read** icon (Eye) to allow public access.
   - *Why:* Your website visitors need to see the colors without logging in.
5. **Add Content:**
   - Go to the **Content** module (Box Icon).
   - Click **Global Theme**.
   - Fill in some test data (e.g., pick a bright red color to test).
   - **Save.**

## Part 2: React Context (The Frontend)

Now we teach React how to fetch and apply these settings. Run these steps in your local `wade-vite-template` folder.

### Step 1: Create the Types

Update `src/lib/directus.ts` to match the fields you just created.

```
// src/lib/directus.ts

// Update the Schema interface
interface Schema {
    global_theme: {
        site_name: string;
        primary_color: string;
        secondary_color: string;
        font_family: string;
        site_logo: string; // This returns the Image ID
    };
}
// ... rest of file stays the same
```

### Step 2: Build the Theme Provider

Create a new file: `src/context/ThemeContext.tsx`.

```
import { createContext, useContext, useEffect, useState } from 'react';
import { readSingleton } from '@directus/sdk';
import { client } from '@/lib/directus';

// 1. Define the shape of our Theme Data
interface Theme {
  site_name: string;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  site_logo: string;
}

// 2. Default values (Fallback if API fails)
const defaultTheme: Theme = {
  site_name: 'Loading...',
  primary_color: '#000000',
  secondary_color: '#ffffff',
  font_family: 'sans-serif',
  site_logo: '',
};

const ThemeContext = createContext<Theme>(defaultTheme);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    async function fetchTheme() {
      try {
        // Fetch the Singleton data
        const data = await client.request(readSingleton('global_theme'));
        
        // Save to state
        // @ts-ignore - Directus types can be tricky with partials
        setTheme(data || defaultTheme);

        // INJECT CSS VARIABLES
        const root = document.documentElement;
        root.style.setProperty('--primary-color', data?.primary_color || '#000');
        root.style.setProperty('--secondary-color', data?.secondary_color || '#fff');
        root.style.setProperty('--font-family', data?.font_family || 'sans-serif');
        
      } catch (error) {
        console.error("Failed to load theme:", error);
      }
    }

    fetchTheme();
  }, []);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Custom Hook for easy access
export const useTheme = () => useContext(ThemeContext);
```

### Step 3: Wrap the App

Open `src/main.tsx` and wrap your app with the provider.

```
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from '@/context/ThemeContext' // Import it

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider> {/* Wrap App */}
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
```

### Step 4: Use the Variables in CSS

Open `src/index.css`. We can now use the variables that Directus is injecting!

```
:root {
  /* These will be overwritten by JavaScript immediately */
  --primary-color: #000;
  --secondary-color: #fff;
  --font-family: sans-serif;
}

body {
  /* This connects the body styles to the variables */
  background-color: var(--secondary-color);
  color: var(--primary-color);
  font-family: var(--font-family);
  transition: background-color 0.3s ease, color 0.3s ease; /* Smooth transition when theme loads */
}
```

### Step 5: Verify

1. Run `npm run dev`.
2. The app should load.
3. **The Test:** Go to Directus, change the `primary_color` to something crazy (like Hot Pink), and save.
4. Refresh your local app. If the text turns Pink, **Phase 3.2 is a success.**
