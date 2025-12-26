// services/main/src/context/AuthContext.tsx

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { client } from '@/lib/directus';
import { readMe, registerUser } from '@directus/sdk';

// Define Data Shape
interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role?: string; 
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (e: string, p: string) => Promise<User>; // Returns User object
  logout: () => Promise<void>;
  register: (e: string, p: string, f: string, l: string) => Promise<void>;
}

// Routing
export const LOGIN_URL = import.meta.env.PROD 
  ? 'https://wade-usa.com/login'
  : 'https://localhost:3000/login'; 


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const normalizeUser = (userData: any): User => {
    return {
      ...userData,
      role: typeof userData.role === 'object' && userData.role !== null
        ? userData.role.id
        : userData.role
    };
  };

  // 1. CHECK AUTH ON LOAD
  useEffect(() => {
    const checkAuth = async () => {

      try {
        await client.refresh();
        // Try to refresh the session automatically
        const currentUser = await client.request(readMe({
          fields: ['id', 'first_name', 'last_name', 'email', 'role.id'] as any
        }));
        setUser(normalizeUser(currentUser));      
      } catch (error) {
        // If auto-login fails, ensure we are clean
        setUser(null);
        localStorage.setItem('wade_auth_status', 'logged_out'); 
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  // 2. LOGIN FUNCTION
  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    client.setToken(null); 

    try {
      // 1. Perform the Login
      await client.login({ email, password });
      
      // 2. Fetch User with CACHE BUSTING
      // We manually construct the request to add '?t=...' which forces a network fetch
      const currentUser = await client.request(() => ({
        path: '/users/me',
        method: 'GET',
        params: {
          fields: ['id', 'first_name', 'last_name', 'email', 'role.id'], // Request Raw Role ID
          t: Date.now() // <--- THE KEY: Unique timestamp prevents caching
        }
      }));
      
      const normalized = normalizeUser(currentUser);

      // 3. Sanity Check
      if (normalized.email.toLowerCase() !== email.toLowerCase()) {
        console.warn("Session Mismatch detected. Cleaning up.");
        client.setToken(null);
        setUser(null);
        localStorage.setItem('wade_auth_status', 'logged_out');
        window.location.href = `${LOGIN_URL}?status=logout`;
        throw new Error("Session mismatch");
      }

      // 4. Success
      localStorage.removeItem('wade_auth_status'); 
      setUser(normalized);
      return normalized;

    } catch (error) {
      client.setToken(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };;

  // 3. LOGOUT FUNCTION
  const logout = async () => {
    setIsLoading(true);
    
    // A. ENABLE THE LOCK IMMEDIATELY
    // This prevents /dashboard from auto-reloading the user
    localStorage.setItem('wade_auth_status', 'logged_out');

    try {
      // B. Try to refresh token first to ensure we have permission to logout
      await client.refresh();
      // C. Tell server to kill cookie
      await client.logout();
    } catch (error) {
      console.warn("Logout failed (Session likely already expired).", error);
    } finally {
      // D. Cleanup Local State
      client.setToken(null); 
      setUser(null);
      
      // E. Redirect
      setIsLoading(false);
      window.location.href = LOGIN_URL;
    }
  };

  // Register 
  const register = async (email: string, password: string, first: string, last: string) => {
    setIsLoading(true);
    try {
      await client.request(registerUser(email, password, {
        first_name: first,
        last_name: last 
      }));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider value={{
      user, 
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};