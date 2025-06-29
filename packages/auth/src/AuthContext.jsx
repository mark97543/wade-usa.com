// Import the core tools we need from React.
import React, { createContext, useContext, useState, useEffect } from 'react';
// Import the navigation hook from React Router to redirect users.
import { useNavigate } from 'react-router-dom';
// Import our pre-configured Directus SDK client.
import client from './api';
// Import specific authentication functions from the Directus SDK.
import { login as apiLogin, logout as apiLogout, readMe, createUser, withToken } from '@directus/sdk';

// 1. CREATE THE CONTEXT
// This creates the "box" that will hold our shared authentication state.
// We initialize it with `null` because when the app first loads, we don't have any auth data yet.
const AuthContext = createContext(null);


// 2. CREATE THE PROVIDER COMPONENT
// This is the main component that will wrap our entire application.
// Its job is to manage all the authentication logic and provide the state to its children.
export const AuthProvider = ({ children }) => {
  // --- STATE MANAGEMENT ---
  // The 'user' state holds the logged-in user's data, or `null` if they are logged out.
  const [user, setUser] = useState(null);
  // The 'loading' state helps us show a "Loading..." message on the initial app load.
  const [loading, setLoading] = useState(true);
  // The 'authError' state holds any error messages from failed login/registration attempts.
  const [authError, setAuthError] = useState(null);

  // Get the navigate function from React Router to use for redirects.
  const navigate = useNavigate();

  // --- SESSION CHECK ON APP LOAD ---
  // This `useEffect` hook runs only ONCE when the AuthProvider is first mounted.
  // Its job is to check if there's an existing login session from a previous visit.
  useEffect(() => {
    const checkAuthSession = async () => {
      // Look for our token in the browser's localStorage.
      const token = localStorage.getItem('directus_token');

      // If a token exists, we try to validate it.
      if (token) {
        try {
          // Tell the SDK to use this token for the next request.
          client.setToken(token); 
          // Ask the API for the current user's data. We populate the 'role' to get access level info.
          const userData = await client.request(readMe({ fields: ['*', 'role.*'] }));
          // If the request is successful, the token is valid. Set the user state.
          setUser(userData);
        } catch (error) {
          // If the request fails (e.g., 401 Unauthorized), the token is bad.
          console.warn('Session token invalid or expired.');
          localStorage.removeItem('directus_token'); // Clean up the bad token.
          setUser(null);
        }
      }
      // Whether we found a user or not, we are done with the initial loading check.
      setLoading(false);
    };

    checkAuthSession();
  }, []); // The empty array [] ensures this effect only runs once on mount.

  // --- AUTHENTICATION FUNCTIONS ---

  // Handles the user login process.
  const login = async (email, password) => {
    setAuthError(null); // Clear any previous errors.
    try {
      // 1. Send the email/password to the Directus API to get a token.
      const response = await client.login(email, password);
      // 2. If successful, save the token in localStorage to persist the session.
      localStorage.setItem('directus_token', response.access_token);
      // 3. Tell the SDK to use this new token for all future requests.
      client.setToken(response.access_token);
      
      // 4. Fetch the full user data (with their role) and update the state.
      const userData = await client.request(readMe({ fields: ['*', 'role.*'] }));
      setUser(userData);
      return true; // Return true to signal success to the LoginPage.
    } catch (error) {
      console.error('Login failed:', error);
      setAuthError('Invalid email or password.');
      throw new Error('Invalid email or password.'); // Throw error so LoginPage can catch it.
    }
  };

  // Handles the user registration process.
  const register = async (email, password) => {
    setAuthError(null);
    try {
      // Use the SDK to send a request to create a new user.
      // The user will be assigned the default role you configured in the Directus Settings.
      await client.request(createUser({ email, password }));
      // For a good user experience, automatically log them in after they register.
      await login(email, password);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      setAuthError('This email may already be registered.');
      throw new Error('Registration failed.');
    }
  };
  
  // Handles the user logout process.
  const logout = async () => {
    try {
      // Tell the Directus API to invalidate the session token.
      await client.logout();
    } catch (error) {
      console.error("Logout API call failed, but clearing client-side session anyway.", error);
    } finally {
      // This `finally` block runs whether the API call succeeded or failed.
      // This ensures the user is always logged out on the front-end.
      localStorage.removeItem('directus_token');
      setUser(null);
      setAuthError(null);
      navigate('/goodbye');
    }
  };

  // --- CONTEXT VALUE ---
  // This object bundles up all the state and functions that we want to make
  // available to the rest of the application.
  const value = {
    user,
    isLoggedIn: !!user, // A handy boolean flag: `!!null` is false, `!!{...}` is true.
    loading,
    authError,
    login,
    logout,
    register,
  };

  // --- RENDER LOGIC ---
  // The AuthProvider component returns the official Provider component from React Context.
  // It passes our `value` object, making it accessible to all child components.
  // We also check the `loading` state to avoid rendering the app before our session check is complete.
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. CREATE THE CUSTOM HOOK
// This is a best-practice shortcut. Instead of other components needing to import both
// `useContext` and `AuthContext`, they can just import and use this one `useAuth` hook.
export const useAuth = () => {
  const context = useContext(AuthContext);
  // This check ensures that if we accidentally try to use this hook outside of the provider,
  // we get a clear error message instead of a silent bug.
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};