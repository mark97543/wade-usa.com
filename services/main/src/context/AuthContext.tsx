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
    console.log("🔄 [AuthContext] App mounted. Triggering checkSession()...");
    checkSession();
  }, []);

  const checkSession = async () => {
    console.log("🕵️ [AuthContext] checkSession: Starting...");
    try {
      // STEP A: Try to exchange the cookie for a new Access Token
      console.log("⏳ [AuthContext] client.refresh(): Attempting to exchange cookie for token...");
      await client.refresh();
      console.log("✅ [AuthContext] client.refresh(): Success! Access Token should be in memory.");

      // STEP B: Fetch User
      console.log("⏳ [AuthContext] readMe(): Fetching user data...");
      const userData = await client.request(readMe({ 
        fields: ['id', 'first_name', 'last_name', 'email', 'role.id', 'role.name'] as any
      }));
      
      console.log("✅ [AuthContext] readMe(): Success!", userData.email);
      setUser(userData as unknown as User);

    } catch (error: any) {
      // Detailed Error Logging
      console.warn("❌ [AuthContext] checkSession FAILED.");
      if (error?.errors) {
        console.error("   -> API Error Details:", JSON.stringify(error.errors, null, 2));
      } else {
        console.error("   -> Network/Unknown Error:", error);
      }
      
      // If refresh fails, we are definitely logged out
      setUser(null);
    } finally {
      setIsLoading(false);
      console.log("🏁 [AuthContext] checkSession: Finished. isLoading = false.");
    }
  };

  // 2. Login Action
  const login = async (email: string, password: string) => {
    console.log(`🔑 [AuthContext] login(): Attempting login for ${email}...`);
    try {
      // We force 'cookie' mode.
      const response = await client.login({ email, password, mode: 'cookie' } as any);
      console.log("✅ [AuthContext] login(): Server responded 200 OK.");
      console.log("   -> Access Token Received?", !!response?.access_token);
      console.log("   -> Expires in:", response?.expires);
      
      console.log("🔄 [AuthContext] login(): Immediately calling checkSession() to verify cookie...");
      await checkSession();

    } catch (error: any) {
        console.error("❌ [AuthContext] login(): FAILED.", error);
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
    console.log("🚪 [AuthContext] logout(): Called.");
    if (!user) {
        console.log("   -> No user to logout. Skipping.");
        return;
    }
    try {
      await client.logout(); 
      console.log("✅ [AuthContext] logout(): Success.");
    } catch (error) {
      console.warn("⚠️ [AuthContext] logout(): Failed (Session might already be dead).", error);
    } finally {
      setUser(null);
    }
  };

  const hasRole = (roleId: string) => user?.role?.id === roleId;
  const isAdmin = user?.role?.id === ROLES.ADMIN;

  return (
    <AuthContext.Provider 
      value={{ user, token: null, isLoading, isAuthenticated: !!user, login, register, logout, hasRole, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);