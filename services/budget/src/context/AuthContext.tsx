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

  // 1. Check Session on Page Load (The "Silent" Login)
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      // STEP A: Try to exchange the cookie for a new Access Token
      // Even if we have no token in memory, this uses the HttpOnly cookie to get one.
      await client.refresh();

      // STEP B: Now that we have a token, fetch the user's details
      const userData = await client.request(readMe({ 
        fields: ['id', 'first_name', 'last_name', 'email', 'avatar', 'role.id', 'role.name'] as any
      }));

      console.log("AUTH: Session restored!", userData.email);
      setUser(userData as unknown as User);

    } catch (error) {
      // This is normal for a guest user (no cookie = 401/403)
      console.log("AUTH: No active session found.");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Login Action
  const login = async (email: string, password: string) => {
    try {
      // Perform the login (Back-end sets the HttpOnly cookie here)
      await client.login({ email, password });
      
      // Immediately fetch the user details to update the UI
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
    try {
      // Destroy the cookie on the server
      await client.logout(); 
    } catch (error) {
      console.warn("Logout failed (session might already be expired)", error);
    } finally {
      // Always clear local state
      setUser(null);
    }
  };

  // 5. Role Helper
  const hasRole = (roleId: string) => user?.role?.id === roleId;
  const isAdmin = user?.role?.id === ROLES.ADMIN;

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token: null, // We don't expose the token to the UI anymore
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