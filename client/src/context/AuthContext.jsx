// /client/src/context/AuthContext.js

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // If using React Router for redirects

//Use the envirenmental variable provided by vite
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Will be 'http://localhost:5000/api' in dev, '/api' in prod
const API_STATUS_URL = `${API_BASE_URL}/auth/status`; // The '/auth/login' part is consistent


//1. Create the Contect Object
// We define the "shape" of the context data for better autocompletion and clarity.
const AuthContext = createContext({
    isAuthenticated:false,
    isLoading:true, //Start loading initially to check auth status
    user: null, //Add user state
    token:null, //Add token state to objet
    login:(token, userData)=>{}, //placeholder functions
    logout: async ()=>{},
})

//3. Create a custim hook for easier consumption
export const useAuth = ()=>{
    const context = useContext(AuthContext)
    if(!context){
      throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
    //State to hold the authentication status, user info, and token
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Track loading state
    const [user, setUser] = useState(null); // Optional: Store user info if needed later
    const [token, setToken] = useState(null)
    const navigate = useNavigate()

    // If redirecting within the provider's login/logout (less common)
    // const navigate = useNavigate();
    
    // 4. Check for token and user in storage on initial load
    // This useEffect runs only once when the provider mounts
    useEffect(()=>{
      console.log("Auth Provider: Checking authentication status on mount...");

      const checkAuth = async ()=>{
        setIsLoading(true) //start loading

        const storedToken = localStorage.getItem('token')// Check local storage for a token

        if(!storedToken){
          // If no token is found in storage, user is not authenticated
          console.log("Auth Provider: No token found in storage.");
          setIsAuthenticated(false);
          setUser(null);
          setToken(null);
          setIsLoading(false); // Stop loading
          return; // Exit the async function
        }

        // If token is found, attempt to verify it with the backend
        try{ 
          const response = await fetch(API_STATUS_URL, {
            method:'GET',
            headers:{
              'Authorization': `Bearer ${storedToken}` // Send the token in the Authorization header
              // 'Content-Type': 'application/json' // Not needed for GET request without body

            },
            // 'credentials': 'include' // Use if your backend relies on cookies/sessions alongside tokens (less common)
          })
          if(response.ok){
            //backend successfully verified token
            const data = await response.json()
            console.log("Auth Provider: Backend verification successful.");
            // Update state based on backend response
            setIsAuthenticated(data.isAuthenticated); // Should be true
            setUser(data.user);                     // Load user data from backend response
            setToken(storedToken);                  // Keep the token we already had

          }else{
            // Backend verification failed (e.g., 401 Invalid/Expired Token, 404 User Not Found)
            console.log("Auth Provider: Backend verification failed.", response.status);
            // Log the user out if the token is invalid or rejected by the backend
            // This clears the invalid token from storage
            // We define logout inside this effect or ensure it's stable if defined outside
            // Let's keep logout defined inside AuthProvider component for stability within effects
            // logout(); // Calling logout requires it to be stable or defined inside/memoized

            // Define logout function within the provider for stability
            const clearAuth = () => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  setToken(null);
                  setUser(null);
                  setIsAuthenticated(false);
                  console.log("Auth Provider: Cleared invalid authentication state.");
                  // Optional: Redirect to login page on failed verification of stored token
                  // navigate('/login');
            };
            clearAuth();
          }
        }catch(error){
          // Handle network errors or other issues during the fetch request
          console.error('Auth Provider: Network or unexpected error during backend status check:', error);
          // Assume not authenticated on network error and clear state
          const clearAuth = () => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  setToken(null);
                  setUser(null);
                  setIsAuthenticated(false);
                  console.log("Auth Provider: Cleared authentication state due to network error.");
                  // Optional: Redirect to login page
                  // navigate('/login');
          }
          clearAuth();
        }finally{
          setIsLoading(false); // Stop loading in either success or error path
        }
      }

      checkAuth()//Call Async function
    }, [])

    //5. Implement the login function
    //It recives the token and user data fetched by the component
    const login = (newToken, userData)=>{
      console.log("Auth Provider: Receiving login data...");
      // Store the new token and user data in local storage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData)); // Store user data as string

      //Update the providers state
      setToken(newToken)
      setUser(userData)
      setIsAuthenticated(true)

      console.log("Auth Provider: State updated, user logged in")

        // Optional: Redirect the user after login directly from here
        // if (navigate) { navigate('/dashboard'); } // Example redirect
    }
  
    // 6. Implement the logout function
    // Called from any component that needs to log the user out
    const logout = useCallback(async () => {
      console.log('Auth Provider: logging out (state/storage only)...'); // Log for this version
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      console.log('Auth Provider: State reset completed.'); // Log for this version
    }, []); // NO dependencies needed now
  
    // 7. The value provided to consuming components via useAuth()
    const contextValue = {
      isAuthenticated, // boolean: true if logged in
      isLoading,     // boolean: true while checking auth status on load or during login/logout
      user,          // object: user data (null if not logged in or not stored)
      token,         // string: JWT token (null if not logged in or not stored)
      login,         // function: to log in (takes token, user data)
      logout         // function: to log out
      // You might add more here later, like user roles/permissions based on 'user' object
  };
  



  // Wrap children with the Context Provider
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
