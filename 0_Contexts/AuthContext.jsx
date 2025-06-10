import React, { createContext, useState, useEffect, useContext } from "react";
import axios from 'axios'; // <-- Import Axios

// 1. Create the Auth Context
const AuthContext = createContext(null);

// Create an Axios instance for Directus API calls
// This instance will be configured to automatically attach the authentication token
const directusApi = axios.create({
    baseURL: import.meta.env.VITE_DIRECTUS_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Axios Request Interceptor: Attach JWT token to every outgoing request if available
directusApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('directus_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Axios Response Interceptor: Handle token expiration or invalidity globally
directusApi.interceptors.response.use(
    (response) => response, // Just return the response if successful
    async (error) => {
        const originalRequest = error.config;
        // Check for 401 Unauthorized errors (common for expired/invalid tokens)
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Prevent infinite retry loops

            // Try to refresh token (Directus has a refresh token flow)
            try {
                const refreshToken = localStorage.getItem('directus_refresh_token');
                if (refreshToken) {
                    const refreshResponse = await directusApi.post('/auth/refresh', { refresh_token: refreshToken });
                    const newAccessToken = refreshResponse.data.data.access_token;
                    const newRefreshToken = refreshResponse.data.data.refresh_token;

                    localStorage.setItem('directus_token', newAccessToken);
                    localStorage.setItem('directus_refresh_token', newRefreshToken);
                    
                    // Update the original request's header with the new token
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    // Re-send the original failed request
                    return directusApi(originalRequest);
                }
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                // If refresh fails, force logout (e.g., redirect to login)
                localStorage.removeItem('directus_token');
                localStorage.removeItem('directus_refresh_token');
                // You might dispatch a logout action here if this interceptor is outside AuthProvider
                // For now, AuthProvider's context will eventually catch this
            }
        }
        return Promise.reject(error);
    }
);


export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // useEffect to check authentication status on mount and listen for storage changes
    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('directus_token');

            if (token) {
                try {
                    // Use the configured directusApi instance to fetch user details
                    const response = await directusApi.get('/users/me'); // Correct endpoint for current user
                    setIsAuthenticated(true);
                    setUser(response.data.data); // Directus API response usually has data in .data.data
                    console.log("Authenticated user data:", response.data.data);
                } catch (error) {
                    console.error("Authentication check failed:", error);
                    // If token invalid/expired, clear storage and log out
                    localStorage.removeItem('directus_token');
                    localStorage.removeItem('directus_refresh_token'); // Clear refresh token too
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
            setLoading(false); // Authentication check is complete
        };

        checkAuthStatus(); // Initial check on component mount

        // Listener for 'storage' events to synchronize state across tabs/windows on the same domain.
        const handleStorageChange = async (event) => {
            if (event.key === 'directus_token') {
                if (event.newValue === null) {
                    setIsAuthenticated(false);
                    setUser(null);
                } else if (event.newValue) {
                    // Re-run full check to validate new token and fetch user details
                    await checkAuthStatus();
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Cleanup function: remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Function to handle login with Directus API using Axios
    const login = async (email, password) => {
        try {
            // Use Axios for login request
            const response = await directusApi.post('/auth/login', { email, password });
            
            // Directus login response provides access_token and refresh_token
            const accessToken = response.data.data.access_token;
            const refreshToken = response.data.data.refresh_token;

            localStorage.setItem('directus_token', accessToken);
            localStorage.setItem('directus_refresh_token', refreshToken); // Store refresh token

            // After successful login, fetch the authenticated user's details
            const currentUserResponse = await directusApi.get('/users/me');
            setIsAuthenticated(true);
            setUser(currentUserResponse.data.data);
            console.log("Login successful! User:", currentUserResponse.data.data);
            return true;
        } catch (error) {
            console.error("Login failed:", error.response ? error.response.data : error.message);
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem('directus_token'); // Clear any partial tokens
            localStorage.removeItem('directus_refresh_token');
            return false;
        }
    };

    // Function to handle logout with Directus API using Axios
    const logout = async () => {
        try {
            // Use Axios for logout request
            // Directus requires refresh token for logout if you want to invalidate it
            const refreshToken = localStorage.getItem('directus_refresh_token');
            if (refreshToken) {
                 await directusApi.post('/auth/logout', { refresh_token: refreshToken });
            }
           
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem('directus_token'); // Ensure tokens are removed
            localStorage.removeItem('directus_refresh_token');
            console.log("Logged out successfully.");
        } catch (error) {
            console.error("Logout failed:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. Create a custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);