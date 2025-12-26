//ProtectedRoute.tsx

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext.tsx";
import { Spinner } from "../atoms/Spinner/Spinner";

export const LOGIN_URL = import.meta.env.PROD 
  ? 'https://wade-usa.com/login'
  : 'https://localhost:3000/login';


export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const {isAuthenticated, isLoading} = useAuth();
  //const location = useLocation();

  //Handle External Redirect via Side Effect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Logic: "Hard" redirect to the external Mothership
      window.location.href = LOGIN_URL;
    }
  }, [isLoading, isAuthenticated]);

  //Loading State
  if(isLoading){
    return <div className="p-10 flex justify-center"><Spinner/></div>
  };

  //Not Logged in? Redirect user out; tirgger redirect
  if(!isAuthenticated){
    return null
  }

  //Logged in? Let them through
  return <>{children}</>;
};

