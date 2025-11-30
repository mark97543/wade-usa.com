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
  accent_color: string;
  surface_color: string;
  danger_color: string;
  success_color: string;
}

// 2. Default values (Fallback if API fails)
const defaultTheme: Theme = {
  site_name: 'Loading...',
  primary_color: '#000000',
  secondary_color: '#ffffff',
  font_family: 'sans-serif',
  site_logo: '',
  accent_color: '#000000',
  surface_color: '#ffffff',
  danger_color: '#000000',
  success_color: '#ffffff',
};

const ThemeContext = createContext<Theme>(defaultTheme);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    async function fetchTheme() {
      try {
        // Fetch the Singleton data
        const data = await client.request(readSingleton('Global_Theme'));
        
        // Save to state
        // @ts-ignore - Directus types can be tricky with partials
        setTheme(data || defaultTheme);

        // INJECT CSS VARIABLES
        const root = document.documentElement;
        root.style.setProperty('--primary-color', data?.primary_color || '#000');
        root.style.setProperty('--secondary-color', data?.secondary_color || '#fff');
        root.style.setProperty('--font-family', data?.font_family || 'sans-serif');
        root.style.setProperty('--accent-color', data?.accent_color || '#000');
        root.style.setProperty('--surface-color', data?.surface_color || '#fff');
        root.style.setProperty('--danger-color', data?.danger_color || '#000');
        root.style.setProperty('--success-color', data?.success_color || '#fff');
        
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