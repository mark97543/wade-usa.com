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
        fields: ['id', 'first_name', 'last_name', 'email', 'avatar', 'role.id', 'role.name'] as any
      }));
      // --- DEBUG LOG ---
      console.log("AUTH: Session valid! User:", userData.email);
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

  // 4. Logout Action
  const logout = async () => {
    // Optimization: If we don't have a user, we don't need to call the server
    if (!user) return;

    try {
      await client.logout();
    } catch (error) {
      // It is normal to get a 400 here if the session cookie was already expired or missing
      console.warn("AUTH: Logout failed (likely session already expired). Local state cleared.", error);
    } finally {
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