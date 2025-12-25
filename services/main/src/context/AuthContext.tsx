// AuthContext.tsx

import { createContext, useContext, useState, useEffect} from 'react';
import type { ReactNode } from 'react';
import { client } from '@/lib/directus';
import {readMe, registerUser} from '@directus/sdk';

// Define Data Shape
interface User{
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role?:string; //Needed for pending user
}

interface AuthContextType{
  user: User | null; //user object 
  isAuthenticated: boolean; //helper 
  isLoading: boolean; //if still checking
  login: (e: string, p: string) => Promise<User>;
  logout: () => Promise<void>;
  register: (e: string, p: string, f: string, l: string) => Promise<void>;
}

//Routing
export const LOGIN_URL = import.meta.env.PROD 
  ? 'https://wade-usa.com/login'   // Production: Always force Main Domain
  : 'https://localhost:3000/login'; // Localhost: Stay on local (Port 5173 is Vite default)


//Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//The provider (Holds Logic)
export const AuthProvider = ({children}: {children: ReactNode}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  //Ensures the role is aleays a string ID
  const normalizeUser = (userData:any): User =>{
    return{
      ...userData,
      role: typeof userData.role === 'object' && userData.role !== null
        ? userData.role.id
        : userData.role
    }
  }

  //Check Auth on load
  useEffect(() => {
    const checkAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('status') === 'logout') {
        // If yes, STOP here. Do not ask Directus for the user.
        setIsLoading(false);
        return; 
      }
      try{
        const currentUser = await client.request(readMe({
          fields:['id', 'first_name', 'last_name', 'email', 'role.id'] as any
        }));
        setUser(normalizeUser(currentUser));      
      }catch(error){
        setUser(null); //no or invalid cookie
      }finally{
        setIsLoading(false); //Completed Checking
      }
    }
    checkAuth();
  }, []);

  //Login Function
  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    client.setToken(null); 

    try {
      await client.login({ email, password });
      
      const currentUser = await client.request(readMe({
        fields: ['id', 'first_name', 'last_name', 'email', 'role.id'] as any
      }));
      
      const normalized = normalizeUser(currentUser);

      // Sanity Check (Zombie Killer)
      if (normalized.email.toLowerCase() !== email.toLowerCase()) {
        client.setToken(null);
        setUser(null);
        window.location.href = `${LOGIN_URL}?status=logout`;
        throw new Error("Session mismatch");
      }

      setUser(normalized);
      return normalized; // <--- RETURN THE USER HERE

    } catch (error) {
      client.setToken(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }


  //Logout Function
  const logout = async () => {
    setIsLoading(true);
    try {
      // 1. Force a token refresh first. 
      // This ensures we have a valid Access Token to perform the logout.
      try {
        await client.refresh();
      } catch (e) {
        // If refresh fails, the session is likely dead anyway, ignore it.
      }

      // 2. NOW call logout. The server should accept it and delete the cookie.
      await client.logout();
      
    } catch (error) {
      console.warn("Logout failed gracefully", error);
    } finally {
      // 3. Cleanup local state
      client.setToken(null);
      setUser(null);
      
      // 4. Force Redirect
      window.location.href = `${LOGIN_URL}?status=logout`;
    }
  };

  //Register 
  const register = async (email: string, password: string, first: string, last: string) => {
    setIsLoading(true);
    try{
      await client.request(registerUser(email, password, {
        first_name: first,
        last_name: last 
      }));
    }catch(error){
      throw error;
    }finally{
      setIsLoading(false);
    }
  }
  
  //Expose the Data
  return(
    <AuthContext.Provider value ={{
      user, 
      isAuthenticated: !!user, //Converts user object to true/false
      isLoading,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  )
};

//The hook (how components use it)
export const useAuth = ()=>{
  const context = useContext(AuthContext);
  if(context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
