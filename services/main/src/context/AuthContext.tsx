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
    console.log("AUTH: Starting Session Check...");
    try {
      // PHASE 1: FORCE REFRESH
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

  const logout = async () => {
    if (!user) return;
    try {
      await client.request({
          path: '/auth/logout',
          method: 'POST',
          axios: { withCredentials: true } 
      } as any); 
    } catch (error) {
      console.warn("AUTH: Logout error (likely already expired).", error);
    } finally {
      setUser(null);
    }
  };

  // --- SAFE ROLE EXTRACTION HELPER ---
  const getRoleId = (userObj: User | null): string | null => {
    if (!userObj || !userObj.role) return null;
    // Check if it's an object (has .id) or just a string
    // @ts-ignore - Bypass TS thinking it's always one or the other if definitions drift
    return typeof userObj.role === 'object' ? userObj.role.id : userObj.role;
  };

  // 5. Role Helper (UPDATED)
  const hasRole = (roleId: string) => {
    return getRoleId(user) === roleId;
  };

  // 6. Admin Helper (UPDATED)
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