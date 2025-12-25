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

  // --- Safe Role Extraction Helper ---
  const getRoleId = (userObj: User | null): string | null => {
    if (!userObj || !userObj.role) return null;
    return typeof userObj.role === 'object' ? userObj.role.id : userObj.role;
  };

  // --- Shared: Fetch User Data ---
  const fetchCurrentUser = async () => {
    try {
      // SIMPLIFIED REQUEST:
      // We removed 'role.id' and 'role.name'.
      // We now just ask for 'role' (which returns the UUID string).
      // This avoids the permission error if the user can't read the "Roles" collection.
      const userData = await client.request(readMe({ 
        fields: ['id', 'first_name', 'last_name', 'email', 'avatar', 'role']
      }));
      
      setUser(userData as unknown as User);
    } catch (error) {
      console.warn("Auth: Fetch user failed", error);
      setUser(null);
    }
  };
  
  // 1. Check Session on Load
  useEffect(() => {
    const initSession = async () => {
      try {
        // Try to refresh the session from the httpOnly cookie
        await client.refresh();
        await fetchCurrentUser();
      } catch (error) {
        // Not logged in
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // 1. Clear any old state first
      client.setToken(null);
      setUser(null);

      // 2. Perform Login
      await client.login({ email, password });
      
      // 3. Fetch User details
      await fetchCurrentUser();
      
    } catch (error) {
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
    try {
      await client.logout();
    } catch (error) {
      console.warn("AUTH: Logout error", error);
    } finally {
      // Always clear local state to update UI
      client.setToken(null);
      setUser(null);
    }
  };

  const hasRole = (roleId: string) => {
    return getRoleId(user) === roleId;
  };

  const isAdmin = hasRole(ROLES.ADMIN);

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