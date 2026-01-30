// /root/projects/wade-template/src/context/Provider.tsx

/**
 * 🔌 MASTER PROVIDER WRAPPER
 * ---------------------------------------------------------------------
 * Purpose: Combines all Context Providers into a single component.
 * Usage: This wraps the entire App in `main.tsx`.
 * Order:
 * 1. AuthProvider (Lowest Level - Security)
 * 2. GlobalProvider (Data Layer)
 * 3. ThemeProvider (UI Layer)
 * ---------------------------------------------------------------------
 */

import type { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import { GlobalProvider } from './GlobalContext';
import {StateProvider} from './StateContext'

export function Providers({ children }: { children: ReactNode }) {
  return (
    // Stack them up! Auth is usually on the outside.
    <AuthProvider>
      <GlobalProvider>
        <StateProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </StateProvider>
      </GlobalProvider>
    </AuthProvider>
  );
}