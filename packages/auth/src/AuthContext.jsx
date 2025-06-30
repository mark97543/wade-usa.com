import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from './api';
// We now need 'readUser' in addition to our other functions
import { login, logout as apiLogout, readMe, createUser, readUser } from '@directus/sdk'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // This function remains the same
    const checkAuthSession = async () => {
      const authStorage = localStorage.getItem('directus_token');
      if (authStorage) {
        try {
          const tokenData = JSON.parse(authStorage);
          client.setToken(tokenData.access_token);
          const userData = await client.request(readMe({ fields: ['*', 'role.*'] }));
          setUser(userData);
        } catch (error) {
          console.warn('Session token invalid or expired.');
          localStorage.removeItem('directus_token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuthSession();
  }, []);

  // --- MODIFIED LOGIN FUNCTION ---
  const loginFunc = async (email, password) => {
    setAuthError(null);
    try {
      // 1. Log in to get the access token and basic user info
      const loginResponse = await client.request(login(email, password));
      localStorage.setItem('directus_token', JSON.stringify(loginResponse));
      client.setToken(loginResponse.access_token);

      // 2. Get the current user's ID
      const me = await client.request(readMe({ fields: ['id'] }));

      // 3. Manually fetch the full user object, explicitly asking for the role data.
      // This is the key to solving the problem.
      const fullUserData = await client.request(readUser(me.id, { fields: ['*', 'role.*'] }));

      // 4. Set the user state with the complete data
      setUser(fullUserData);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setAuthError('Invalid email or password.');
      throw new Error('Invalid email or password.');
    }
  };

  const register = async (email, password) => {
    setAuthError(null);
    try {
      await client.request(createUser({
        email: email,
        password: password,
        role: 'd628f338-72bc-4fe9-8041-2794524444b7',
      }));
      await loginFunc(email, password);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      const errorMessage = error.errors?.[0]?.message || 'This email may already be registered.';
      setAuthError(errorMessage);
      throw new Error('Registration failed.');
    }
  };

  const logoutFunc = async () => {
    try {
      const authStorage = JSON.parse(localStorage.getItem('directus_token'));
      const refreshToken = authStorage?.refresh_token;

      if (refreshToken) {
        await client.request(apiLogout(refreshToken));
      }
    } catch (error) {
      console.error("Logout API call failed, but clearing client-side session anyway.", error);
    } finally {
      localStorage.removeItem('directus_token');
      setUser(null);
      setAuthError(null);
      navigate('/goodbye');
    }
  };

  const value = { user, isLoggedIn: !!user, loading, authError, login: loginFunc, logout: logoutFunc, register };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
//