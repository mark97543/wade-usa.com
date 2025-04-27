// /client/src/context/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // If using React Router for redirects

//1. Create the Contect Object
// We define the "shape" of the context data for better autocompletion and clarity.
const AuthContext = createContext({
    isAuthenticated:false,
    isLoading:true, //Start loading initially to check auth status
    login:async (password)=>{}, //placeholder functions
    logout: async ()=>{},
})

//3. Create a custim hook for easier consumption
export const useAuth = ()=>{
    return useContext(AuthContext)
}

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Track loading state
    // const [user, setUser] = useState(null); // Optional: Store user info if needed later
  
    const navigate = useNavigate(); // Optional: Get navigate function if using React Router
  
    // Function to check authentication status with the backend
    const checkAuthStatus = async () => {
      setIsLoading(true); // Start loading
      try {
        // IMPORTANT: Adjust '/api/auth/status' if your endpoint is different
        const response = await fetch('/api/auth/status', {
           method: 'GET',
           headers: {
              // Include credentials if your server session requires cookies
              // 'credentials': 'include' // May not be needed depending on setup
           }
        });
  
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.isAuthenticated);
          console.log('Auth status checked:', data.isAuthenticated);
        } else {
          // Handle non-OK responses (e.g., server error)
          setIsAuthenticated(false);
           console.error('Failed to check auth status:', response.statusText);
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setIsAuthenticated(false); // Assume not authenticated on error
      } finally {
        setIsLoading(false); // Stop loading
      }
    };
  
    // Function to handle login
    const login = async (password) => {
      setIsLoading(true); // Start loading
      try {
        // IMPORTANT: Adjust '/api/login' if your endpoint is different
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
             // 'credentials': 'include' // May not be needed depending on setup
          },
          body: JSON.stringify({ password: password }), // Send password in the body
        });
  
        const data = await response.json();
  
        if (response.ok && data.success) {
          setIsAuthenticated(true);
          console.log('Login successful');
          // Optional: Redirect user after successful login using useNavigate()
          // navigate('/dashboard'); // Example redirect
          return true; // Indicate success
        } else {
          setIsAuthenticated(false);
          console.error('Login failed:', data.message || response.statusText);
          // Optionally, you could return the error message: return data.message;
          return false; // Indicate failure
        }
      } catch (error) {
        console.error('Error during login:', error);
        setIsAuthenticated(false);
        return false; // Indicate failure
      } finally {
          setIsLoading(false); // Stop loading
      }
    };
  
    // Function to handle logout
    const logout = async () => {
       setIsLoading(true); // Start loading
      try {
         // IMPORTANT: Adjust '/api/logout' if your endpoint is different
        const response = await fetch('/api/logout', {
           method: 'POST',
           headers: {
              // 'credentials': 'include' // May not be needed depending on setup
           }
        });
  
        if (response.ok) {
          setIsAuthenticated(false);
          console.log('Logout successful');
           // Optional: Redirect user after logout
           // navigate('/login'); // Example redirect
        } else {
           // Handle non-OK responses (e.g., server error during logout)
           console.error('Logout failed:', response.statusText);
        }
      } catch (error) {
        console.error('Error during logout:', error);
        // Decide if you want to force logout state even if API fails
        // setIsAuthenticated(false);
      } finally {
         setIsLoading(false); // Stop loading
      }
    };
  
    // Check authentication status when the provider mounts (app loads)
    useEffect(() => {
      checkAuthStatus();
    }, []); // Empty dependency array means this runs only once on mount
  
    // The value provided to consuming components
    const contextValue = {
      isAuthenticated,
      isLoading,
      // user, // Include if you add user state
      login,
      logout,
    };
     // Wrap children with the Context Provider
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
