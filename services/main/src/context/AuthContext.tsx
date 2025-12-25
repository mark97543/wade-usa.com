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
  login: (e: string, p: string) => Promise<void>;
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
      try{
        const currentUser = await client.request(readMe({
          fields:['id', 'first_name', 'last_name', 'email', 'role'] as any
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
  const login = async (email: string, password:string)=>{
    setIsLoading(true);
    try{
      await client.login({email, password}); //Exchange password for cookie
      const currentUser = await client.request(readMe({
        fields:['id', 'first_name', 'last_name', 'email', 'role'] as any
      }));
      setUser(normalizeUser(currentUser));
    }catch(error){
      throw error; //Let the login page handle the error message
    }finally{
      setIsLoading(false);
    }
  }

  //Logout Function 
  const logout = async () =>{
    setIsLoading(true);
    try{
      await client.logout(); //Clear Cookie
    }catch(error){
      console.warn("Logout failed (Session likely already expired).", error);
    }finally{
      client.setToken(null); //Clear Token
      setIsLoading(false);
      setUser(null); //Clear User
      window.location.href = LOGIN_URL; 
    }
  }

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
