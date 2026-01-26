/**
 * 🎨 THEME CONTEXT
 * ---------------------------------------------------------------------
 * Purpose: Manages the visual state of the application.
 * Responsibilities:
 * 1. Stores User Preference for Dark/Light mode.
 * 2. Fetches 'app_theme' colors from Directus.
 * 3. Injects CSS variables (like --primary-color) into the app.
 * ---------------------------------------------------------------------
 */

import { createContext, useContext, useState, useEffect} from 'react';
import type { ReactNode } from 'react';
import { readSingleton } from '@directus/sdk';
import client from '../services/directus';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // 1. Theme Mode State (Default to 'dark' as requested)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wade_theme') as ThemeMode;
      return saved || 'dark';
    }
    return 'dark';
  });

  // 2. Data State (Holds the raw colors from Directus)
  const [themeData, setThemeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 3. Fetch Colors from Directus on Load
  useEffect(() => {
    const fetchColors = async () => {
      try {
        // 'app_theme' is the name of your Singleton collection
        const data = await client.request(readSingleton('app_theme'));
        setThemeData(data);
      } catch (error) {
        console.error('Failed to load theme:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchColors();
  }, []);

  // 4. APPLY COLORS: Whenever 'theme' or 'themeData' changes, update CSS
  useEffect(() => {
    if (!themeData) return;
     
      const root = document.documentElement; // The <html> tag

      // 1. AUTO-MAP EVERYTHING (Radii, Spacing, Static Colors)
      // This turns 'radius_lg' -> '--radius-lg' automatically
      Object.keys(themeData).forEach((key) => {
        const value = themeData[key];
        if (value) {
          const cssVar = `--${key.replace(/_/g, '-')}`;
          root.style.setProperty(cssVar, value);
        }
      });

      // 2. THE FLIP-FLOP SCHEME (The only part we "look out for")
      // We define which variables should change based on the mode.
      const themeKeys = ['bg', 'surface', 'text'];

      themeKeys.forEach((key) => {
        // Looks for 'dark_bg' or 'light_bg' based on the current theme state
        const dbKey = `${theme}_${key}`; 
        const colorValue = themeData[dbKey];
        
        if (colorValue) {
          root.style.setProperty(`--c-${key}`, colorValue);
        }
      });

      // 3. THE DEBUG CALL (PLACE IT HERE)
      // This is the last thing the effect does before finishing.
      if (import.meta.env.DEV) {
        debugColors(themeData, theme);
      }
      
  }, [theme, themeData]);

  // 5. Toggle Logic
  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('wade_theme', newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

//=========================================================
//=----------------Debug Functions -----------------------=
//=========================================================

const debugColors = (themeData: any, currentTheme: string) => {
  //console.groupCollapsed(`🎨 Theme Debugger [Mode: ${currentTheme.toUpperCase()}]`);

  const dynamicKeys = ['bg', 'surface', 'text']; // The flipping colors
  
  // 1. SHOW DYNAMIC VARIABLES (The ones currently in use)
  //console.log('%c DYNAMIC THEME VARIABLES ', 'background: #333; color: #fff; font-weight: bold;');
  dynamicKeys.forEach(key => {
    const activeHex = themeData[`${currentTheme}_${key}`];
    // console.log(
    //   `%c    %c --c-${key.padEnd(10)} %c ${activeHex}`,
    //   `background: ${activeHex}; border: 1px solid #777; border-radius: 3px; padding: 0 8px;`,
    //   'font-weight: bold; font-family: monospace;',
    //   'color: #888;'
    // );
  });

  // 2. SHOW STATIC VARIABLES (Brand colors, Radii, etc.)
  //console.log('%c STATIC SYSTEM VARIABLES ', 'background: #333; color: #fff; font-weight: bold; margin-top: 10px;');
  Object.keys(themeData).forEach(key => {
    // Skip the dynamic keys so we don't double-count
    if (key.startsWith('dark_') || key.startsWith('light_')) return;

    const val = themeData[key];
    const cssVar = `--${key.replace(/_/g, '-')}`;
    const isColor = val?.toString().startsWith('#');

    // console.log(
    //   `%c ${isColor ? '  ' : '📏'} %c ${cssVar.padEnd(20)} %c ${val}`,
    //   isColor ? `background: ${val}; border: 1px solid #777; border-radius: 3px;` : '',
    //   'font-weight: bold; font-family: monospace;',
    //   'color: #888;'
    // );
  });

  console.groupEnd();
};