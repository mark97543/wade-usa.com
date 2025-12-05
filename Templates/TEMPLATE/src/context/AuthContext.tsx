import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  readMe, 
  createUser,
  // NOTE: client.logout() is registered on the client instance 
  // via the authentication('cookie', ...) extension.
} from '@directus/sdk';
import { client, ROLES } from '@/lib/directus'; 
import type { User, AuthContextType } from '@/types/user';

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- Safe Role Extraction Helper ---
  // Must be defined here to be available to hasRole/isAdmin
  const getRoleId = (userObj: User | null): string | null => {
    if (!userObj || !userObj.role) return null;
    // @ts-ignore - Safely check if it's an object or a string UUID
    return typeof userObj.role === 'object' ? userObj.role.id : userObj.role;
  };
  
  // 1. Silent Refresh (Check session on load)
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    console.log("AUTH: Starting Session Check...");
    try {
      // PHASE 1: FORCE REFRESH
      // This explicitly forces the cookie exchange for a new Access Token.
      console.log("AUTH: Attempting to refresh token from cookie...");
      await client.refresh();
      console.log("AUTH: Token refreshed successfully.");

      // PHASE 2: FETCH USER
      const userData = await client.request(readMe({ 
        fields: ['id', 'first_name', 'last_name', 'email', 'avatar', 'role.id', 'role.name'] as any
      }));
      
      console.log("AUTH: User Data received:", userData.email);
      setUser(userData as unknown as User);

    } catch (error) {
      console.warn("AUTH: Session check failed.", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const authResponse = await client.login({ email, password });
      client.setToken(authResponse.access_token);
      await checkSession();
      client.setToken(null);
    } catch (error: any) {
        console.error("AUTH: Login failed.", error);
        throw error; 
    }
  };

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
    if (!user) return;
    try {
      // CRITICAL FIX: Use the built-in client.logout() method.
      // This method is automatically provided by the authentication extension
      // and knows how to send the cookie to the server to revoke the session.
      // It is cleaner and more reliable than a manual request override.
      // @ts-ignore
      await client.logout();
      console.log("AUTH: Server-side token revoked successfully.");

    } catch (error) {
      // It is common to get an error if the token has already expired on the server,
      // but we still want to clear the local state to log the user out.
      console.warn("AUTH: Logout error on server (session may be expired). Clearing local state.", error);
    } finally {
      // CRITICAL: Always clear local state to force UI update and redirect on next load
      setUser(null);
    }
  };

  const hasRole = (roleId: string) => {
    return getRoleId(user) === roleId;
  };

  const isAdmin = getRoleId(user) === ROLES.ADMIN;

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