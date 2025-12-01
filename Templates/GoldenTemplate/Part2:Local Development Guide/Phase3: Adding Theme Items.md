# Guide: Adding New Theme Items

**Objective:** Add a new customizable setting (e.g., `sidebar_bg` or `border_radius`) to Directus and use it in your React application.

## Prerequisite: The "Smart Loop" Logic

For this guide to work, your `src/context/ThemeContext.tsx` must contain the automatic injection loop. This ensures you never have to manually map variables again.

**Verify your file matches this:**

```
// src/context/ThemeContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { readSingleton } from '@directus/sdk';
import { client } from '@/lib/directus';

interface Theme {
  [key: string]: any; // Allows any field from Directus
}

const ThemeContext = createContext<Theme>({});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>({});

  useEffect(() => {
    async function fetchTheme() {
      try {
        // Fetch the Singleton data
        const data = await client.request(readSingleton('Global_Theme'));
        
        if (data) {
            setTheme(data);

            // --- THE SMART LOOP ---
            // This takes EVERY field from Directus and makes it a CSS variable.
            const root = document.documentElement;
            
            Object.entries(data).forEach(([key, value]) => {
                // Only turn strings/numbers into variables (ignore objects/arrays)
                if (typeof value === 'string' || typeof value === 'number') {
                    // Convert "accent_color" -> "--accent-color"
                    const cssVarName = `--${key.replace(/_/g, '-')}`;
                    root.style.setProperty(cssVarName, String(value));
                }
            });
            // ----------------------
        }
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

export const useTheme = () => useContext(ThemeContext);
```

## Step 1: Directus Configuration (The Source)

You must first create the data field so the API can serve it.

1. **Log in to Directus Admin:** `https://api.wade-usa.com/admin`
2. **Navigate:** Settings (Gear Icon) -> Data Model.
3. **Select Collection:** Click on `Global Theme` (`Global_Theme`).
4. **Add Field:**
   - **Type:** Choose `Color` (for hex codes) or `Input` (for things like "4px").
   - **Key (Crucial):** This will become your CSS variable name.
     - Example: `sidebar_bg`
     - *Note: Use underscores (`_`). The React loop automatically converts `_` to `-`.*
5. **Save Field.**
6. **Add Content:**
   - Go to the **Content Module** -> **Global Theme**.
   - Set a value for your new field (e.g., `#1e293b`).
   - **Save.**

## Step 2: TypeScript Definition (The Safety)

While the code *runs* without this, you must update the type definition so VS Code provides autocomplete.

**File:** `src/lib/directus.ts`

1. Open the file.
2. Locate the `Global_Theme` interface.
3. Add your new field to the list.

```
interface Schema {
    Global_Theme: {
        site_name: string;
        primary_color: string;
        // ... existing fields ...
        
        // NEW FIELD HERE:
        sidebar_bg: string; 
    };
}
```

## Step 3: CSS Usage (The Implementation)

You **do not** need to edit `ThemeContext.tsx`. The smart loop has already injected your new field into the browser as a CSS variable.

- Directus Key: `sidebar_bg`
- CSS Variable: `--sidebar-bg`

**File:** Any CSS Module (e.g., `src/components/layout/Sidebar.module.css`) or Global CSS.

```
.sidebar {
    /* Use the variable immediately */
    background-color: var(--sidebar-bg);
    
    /* Fallback (Optional, good practice while loading) */
    background-color: var(--sidebar-bg, #000); 
}
```

## Summary of Logic

| Location         | Input          | Transformation          | Output                    |
| ---------------- | -------------- | ----------------------- | ------------------------- |
| **Directus**     | `sidebar_bg`   | API Response JSON       | `"sidebar_bg": "#1e293b"` |
| **ThemeContext** | `sidebar_bg`   | `key.replace('_', '-')` | `--sidebar-bg`            |
| **Browser**      | `--sidebar-bg` | CSS Variable            | `#1e293b`                 |

|      |      |      |      |
| ---- | ---- | ---- | ---- |
|      |      |      |      |
|      |      |      |      |
|      |      |      |      |
