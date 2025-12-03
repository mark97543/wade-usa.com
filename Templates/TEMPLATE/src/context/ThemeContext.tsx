import { createContext, useContext, useEffect, useState } from 'react';
import { readSingleton } from '@directus/sdk';
import { client } from '@/lib/directus';

// 1. Define the shape of our Theme Data
// We use [key: string]: any to tell TypeScript "Expect anything"
interface Theme {
  site_name: string;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  site_logo: string;
  [key: string]: any; 
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
        // NOTE: Must match the Collection Key in Directus exactly (Case Sensitive!)
        const data = await client.request(readSingleton('Global_Theme'));
        
        if (data) {
            // @ts-ignore
            setTheme(data);

            // --- THE SMART LOOP ---
            // This takes EVERY field from Directus and makes it a CSS variable.
            // No manual updates required ever again.
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

// 3. Custom Hook for easy access
export const useTheme = () => useContext(ThemeContext);