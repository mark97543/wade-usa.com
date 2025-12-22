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

  // --- Helper: Get User Profile ---
  // We extract this so we can call it after login WITHOUT forcing a refresh
  const fetchUser = async () => {
    const userData = await client.request(readMe({ 
      fields: ['id', 'first_name', 'last_name', 'email', 'avatar', 'role.id', 'role.name'] as any
    }));
    console.log("AUTH: User Data received:", userData.email);
    setUser(userData as unknown as User);
  };

  // --- Helper: Role ID Extraction ---
  const getRoleId = (userObj: User | null): string | null => {
    if (!userObj || !userObj.role) return null;
    // @ts-ignore
    return typeof userObj.role === 'object' ? userObj.role.id : userObj.role;
  };
  
  // 1. Check Session (Runs on Page Load)
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    console.log("AUTH: Starting Session Check...");
    try {
      // Only try to refresh if we are checking an existing session
      console.log("AUTH: Attempting to refresh token from cookie...");
      await client.refresh();
      
      // If refresh works, fetch the user
      await fetchUser();

    } catch (error) {
      console.warn("AUTH: Session check failed (User not logged in or cookie missing).");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Login Action
  const login = async (email: string, password: string) => {
    try {
      // A. Perform Login
      const authResponse = await client.login({ email, password });
      
      // B. Manually set the token in memory (SDK needs this if not using cookies)
      if (authResponse.access_token) {
        client.setToken(authResponse.access_token);
      }

      // C. Fetch User DIRECTLY (Do not call checkSession/refresh here)
      await fetchUser();

      // Note: We do NOT setToken(null) here anymore. 
      // We keep the token in memory so the session stays alive for this visit.

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
      // @ts-ignore
      await client.logout(); 
      console.log("AUTH: Logout successful.");
    } catch (error) {
      console.warn("AUTH: Logout error", error);
    } finally {
      setUser(null);
      client.setToken(null); // Clear memory token
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