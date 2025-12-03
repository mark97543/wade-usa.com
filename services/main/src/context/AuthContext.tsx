import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  readMe, 
  createUser,
  // CRITICAL: Import the Type for the Login response (REMOVED: AuthResult)
} from '@directus/sdk';
import { client, ROLES } from '@/lib/directus'; // Import the ROLES constant
import type { User, AuthContextType } from '@/types/user';

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Silent Refresh (Check session on load)
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    // --- DEBUG LOG ---
    console.log("AUTH: Attempting to check session via readMe()...");
    // -----------------
    try {
      const userData = await client.request(readMe({ 
        fields: ['id', 'first_name', 'last_name', 'email', 'role'] as any
      }));
      // --- DEBUG LOG ---
      console.log("AUTH: Session valid! User:", userData);
      // -----------------
      setUser(userData as unknown as User);
    } catch (error) {
      // --- DEBUG LOG ---
      console.warn("AUTH: Session check failed (401 expected if not logged in).");
      // -----------------
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Login Action
  const login = async (email: string, password: string) => {
    try {
      // 1. Send Login Request
      // NOTE: Removed explicit AuthResult type. TS will infer the structure from client.login()
      const authResponse = await client.login({ email, password });
      
      // --- DEBUG LOG ---
      console.log("AUTH: client.login() succeeded. Received Token.");
      // -----------------

      // 2. Temporarily set the token on the client instance (Fix for localhost/caching issues)
      client.setToken(authResponse.access_token);
      
      // 3. Check the session using the new, fresh token
      await checkSession();
      
      // 4. Clear the token immediately after use (since we rely on the cookie)
      client.setToken(null);

    } catch (error: any) {
        // --- DEBUG LOG ---
        console.error("AUTH: Login failed in AuthContext.", error);
        throw error; // Re-throw the error so the Login.tsx page can catch and display it
        // -----------------
    }
  };

  // 3. Register Action (THE GATEKEEPER)
  const register = async (email: string, password: string, first_name: string, last_name: string) => {
    await client.request(createUser({
      email,
      password,
      first_name,
      last_name,
      role: ROLES.PENDING,
    }));
  };

  // 4. Logout Action (THE FIX)
  const logout = async () => {
    // Optimization: If we don't have a user, we don't need to call the server
    if (!user) return;

    try {
      // FIX: Manually call the endpoint and inject the withCredentials property
      await client.request({
          path: '/auth/logout',
          method: 'POST',
          // CRITICAL: Inject withCredentials to force the browser to send the cookie
          axios: { withCredentials: true } 
      } as any); 
    } catch (error) {
      // It is normal to get a 400/500 here if the session cookie was already expired or missing
      console.warn("AUTH: Logout failed gracefully (session likely already cleared). Local state cleared.", error);
    } finally {
      // Always clear local state regardless of API success
      setUser(null);
    }
  };

  // 5. Role Helper
  const hasRole = (roleId: string) => {
    return user?.role?.id === roleId;
  };

  const isAdmin = user?.role?.id === ROLES.ADMIN;

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token: null,
        isLoading, 
        isAuthenticated: !!user,
        login, 
        register, 
        logout,
        hasRole,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);