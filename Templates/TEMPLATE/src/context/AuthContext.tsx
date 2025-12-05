// services/main/src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  readMe, 
  createUser, 
  // We use the SDK commands, but let the client handle the state
} from '@directus/sdk';
import { client, ROLES } from '@/lib/directus';
import type { User, AuthContextType } from '@/types/user';

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  // Default to true so we don't flash the login screen while checking
  const [isLoading, setIsLoading] = useState(true); 

  // 1. SESSION CHECK (Run once on mount)
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      // We don't need to manually refresh; the SDK autoRefresh:true handles it.
      // We just try to fetch the user. If we have a valid cookie, this succeeds.
      const userData = await client.request(readMe({ 
        fields: ['id', 'first_name', 'last_name', 'email', 'avatar', 'role.id', 'role.name'] as any
      }));
      
      console.log("AUTH: Session Active for", userData.email);
      setUser(userData as unknown as User);
    } catch (error) {
      // 401 is expected if not logged in.
      // We don't log an error here to keep the console clean for guests.
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. LOGIN ACTION
  const login = async (email: string, password: string) => {
    try {
      // A. Perform the login
      // This sets the access token in memory AND the refresh cookie in the browser
      await client.login({ email, password }); // Wrap arguments in an object {}

      // B. Verify the session immediately
      // We do this to get the User Object (name, role, etc) which login() doesn't return
      await checkSession();

    } catch (error: any) {
        console.error("AUTH: Login Failed", error);
        throw error; // Throw so the UI can show an error message
    }
  };

  // 3. LOGOUT ACTION
  const logout = async () => {
    try {
      // A. Call API to destroy the cookie on the server
      await client.logout(); 
    } catch (error) {
      console.warn("AUTH: Logout API call failed (Session likely expired already)");
    } finally {
      // B. Always wipe local state
      setUser(null);
      // Optional: Redirect is handled by the UI consuming this context
    }
  };

  // 4. REGISTER ACTION (The Gatekeeper)
  const register = async (email: string, password: string, first_name: string, last_name: string) => {
    await client.request(createUser({
      email,
      password,
      first_name,
      last_name,
      role: ROLES.PENDING, // Auto-assign Pending Role
    }));
  };

  // 5. HELPER: Check Role
  const hasRole = (roleId: string) => {
    // Handle both object and string formats for role
    const currentRoleId = typeof user?.role === 'object' ? user.role.id : user?.role;
    return currentRoleId === roleId;
  };

  const isAdmin = hasRole(ROLES.ADMIN);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token: null, // We don't expose the raw token to the UI anymore
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