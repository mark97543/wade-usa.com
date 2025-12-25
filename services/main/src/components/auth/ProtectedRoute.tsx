//ProtectedRoute.tsx

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.tsx";
import { Spinner } from "../atoms/Spinner/Spinner";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const {isAuthenticated, isLoading} = useAuth();
  const location = useLocation();

  //Still Checking show loading
  if(isLoading){
    return <div className="p-10 flex justify-center"><Spinner/></div>
  };

  //Not Logged in? Redirect user out
  //Save the from Location so we can redirect them back after they log in 
  if(!isAuthenticated){
    return <Navigate to="/login" state={{from: location}} replace/>
  }

  //Logged in? Let them through
  return <>{children}</>;
};

