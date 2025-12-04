import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  readMe, 
  createUser,
} from '@directus/sdk';
import { client, ROLES } from '@/lib/directus'; 
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
    console.log("AUTH: Checking session...");
    try {
      // --- THE MISSING BRIDGE ---
      // This uses the HttpOnly cookie to get a fresh Access Token.
      // If the user has a cookie, this succeeds. If not, it throws (Goes to catch).
      await client.refresh();

      // Now that we have a token (in memory), we can fetch the user.
      const userData = await client.request(readMe({ 
        fields: ['id', 'first_name', 'last_name', 'email', 'role.id', 'role.name'] as any
      }));
      
      console.log("AUTH: Session valid for:", userData.email);
      setUser(userData as unknown as User);
    } catch (error) {
      // Normal behavior for a guest user (no cookie = no session)
      console.log("AUTH: No active session (Guest Mode).");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Login Action
  const login = async (email: string, password: string) => {
    try {
      // We force 'cookie' mode. The server sets the HttpOnly cookie.
      // The response contains the access_token for immediate use.
      await client.login({ email, password, mode: 'cookie' } as any);
      
      console.log("AUTH: Login successful. refreshing session...");
      
      // We call checkSession to fetch the full user object immediately
      await checkSession();

    } catch (error: any) {
        console.error("AUTH: Login failed.", error);
        throw error; 
    }
  };

  // 3. Register Action
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
    if (!user) return;
    try {
      // Destroy the cookie on the server
      await client.logout(); 
    } catch (error) {
      console.warn("AUTH: Logout failed gracefully.", error);
    } finally {
      setUser(null);
    }
  };

  // 5. Role Helpers
  const hasRole = (roleId: string) => user?.role?.id === roleId;
  const isAdmin = user?.role?.id === ROLES.ADMIN;

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token: null, // Token is internal now
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