// /root/projects/wade-template/src/context/AuthContext.tsx

/**
 * Authentication Context (The "Power Grid")
 * -----------------------------------------
 * This file manages the GLOBAL state of the user.
 * * It answers the question "Who is logged in?" for the entire app.
 * * Responsibilities:
 * 1. Checks for an active session immediately when the app loads (useEffect).
 * 2. Holds the 'user' object so any component can access it without prop-drilling.
 * 3. Provides the 'checkSession' function to refresh state after login/logout.
 * * Usage:
 * const { user, loading, checkSession } = useAuth();
 */



import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { restoreSession } from '../services/auth';
import { readMe } from '@directus/sdk'; 
import { client } from '../lib/directus';

interface AuthContextType {
  user: any;
  loading: boolean;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    try {
      const result = await client.request(readMe());
      setUser(result);
    } catch (error: any) {
      // 🛡️ THE PURGE LOGIC
      // Check for 'TOKEN_EXPIRED' OR a general 401 Unauthorized status
      const isUnauthorized = 
        error?.errors?.some((e: any) => e?.extensions?.code === 'TOKEN_EXPIRED') ||
        error?.response?.status === 401;

      if (isUnauthorized) {
        console.warn("⚠️ Dead session detected. Cleaning up local storage...");
        
        // Clear SDK state
        await client.setToken(null); 
        
        // Clear Physical Storage (Matches Directus default keys)
        localStorage.removeItem('directus_token');
        localStorage.removeItem('directus_refresh_token');
        
        setUser(null);
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      await restoreSession(); 
      await checkSession();   
    };
    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);