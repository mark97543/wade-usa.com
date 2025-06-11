import React, { createContext, useState, useEffect, useContext } from "react";
import axios from 'axios';
// You might also need useNavigate here if you want to redirect directly from interceptor
// import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

const directusApi = axios.create({
    baseURL: import.meta.env.VITE_DIRECTUS_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Axios Request Interceptor: (No changes needed here)
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
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        // Check for 401 Unauthorized errors on non-retry requests
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark as retried to prevent infinite loop

            // Try to refresh token if we have one
            const refreshToken = localStorage.getItem('directus_refresh_token');
            if (refreshToken) {
                try {
                    const refreshResponse = await directusApi.post('/auth/refresh', { refresh_token: refreshToken });
                    const newAccessToken = refreshResponse.data.data.access_token;
                    const newRefreshToken = refreshResponse.data.data.refresh_token;

                    localStorage.setItem('directus_token', newAccessToken);
                    localStorage.setItem('directus_refresh_token', newRefreshToken);
                    
                    // Update the original request's header with the new token
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    // Re-send the original failed request
                    return directusApi(originalRequest);
                } catch (refreshError) {
                    console.error("Token refresh failed in interceptor:", refreshError.response ? refreshError.response.data : refreshError.message);
                    // If refresh fails, force logout by clearing tokens
                    localStorage.removeItem('directus_token');
                    localStorage.removeItem('directus_refresh_token');
                    // --- IMPORTANT: This part needs to signal to the AuthProvider to update state ---
                    // Option A (Best): Directly update AuthContext's state (requires AuthProvider instance)
                    // Option B (Good): Dispatch a custom event or rely on `storage` event (what we have)
                    // Option C (Simple but can create redirect issues): window.location.href = '/login';
                    window.dispatchEvent(new Event('storageCleared')); // Custom event to signal tokens cleared
                }
            } else {
                // If no refresh token, or if the original request was already a refresh attempt that failed
                localStorage.removeItem('directus_token');
                localStorage.removeItem('directus_refresh_token');
                 window.dispatchEvent(new Event('storageCleared')); // Signal tokens cleared
            }
        }
        return Promise.reject(error);
    }
);


export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    // const navigate = useNavigate(); // If you want to use navigate directly here

    // Function to handle full logout and state reset
    const resetAuthState = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('directus_token');
        localStorage.removeItem('directus_refresh_token');
        //console.log("Auth state reset: User logged out.");
        // If needed, navigate to login page after state reset
        // navigate('/login'); // Only if this component has access to navigate and you want an immediate redirect
    };


    useEffect(() => {
        //console.log('AuthContext useEffect: Running initial check.');
        const checkAuthStatus = async () => {
            //console.log('AuthContext: checkAuthStatus started.');
            const token = localStorage.getItem('directus_token');
            const refreshToken = localStorage.getItem('directus_refresh_token'); // Ensure we get refresh token
            //console.log('AuthContext: Access Token found?', !!token, 'Refresh Token found?', !!refreshToken);

            if (token) {
                try {
                    const response = await directusApi.get('/users/me?fields=*,role.name');
                    setIsAuthenticated(true);
                    setUser(response.data.data);
                    //console.log("AuthContext: User authenticated and data set.", response.data.data);
                } catch (error) {
                    console.error("AuthContext: Initial authentication check failed (token invalid/expired):", error);
                    // Force a full state reset if initial check fails
                    resetAuthState(); // <-- Call reset function here
                }
            } else {
                //console.log("AuthContext: No access token found, user is not authenticated.");
                resetAuthState(); // <-- Call reset function here if no token
            }
            setLoading(false); // Authentication check is complete
            //console.log('AuthContext: checkAuthStatus finished. Loading set to false.');
        };

        checkAuthStatus(); // Initial check on component mount

        const handleStorageChange = async (event) => {
            console.log('AuthContext: Storage event detected.', event.key);
            if (event.key === 'directus_token' || event.key === 'directus_refresh_token') {
                // If any relevant token changes (removed or added), re-run checkAuthStatus
                // or simply reset state if token is null
                if (event.newValue === null) {
                    resetAuthState(); // Reset state immediately if token is removed from anywhere
                    console.log('AuthContext: Token removed via storage event, state reset.');
                } else if (event.newValue && !isAuthenticated) { // Only re-check if new token is set AND we're not already authenticated
                    await checkAuthStatus();
                }
            }
        };

        // Listen for our custom event to signal tokens cleared from interceptor
        const handleTokensCleared = () => {
            console.log('AuthContext: Custom "storageCleared" event received, forcing state reset.');
            resetAuthState();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('storageCleared', handleTokensCleared); // Listen for custom event

        return () => {
            //console.log('AuthContext useEffect: Cleaning up listeners.');
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('storageCleared', handleTokensCleared); // Clean up custom event listener
        };
    }, []);

    // Add console logs for state changes for login/logout
    //console.log('AuthContext Render: isAuthenticated=', isAuthenticated, 'loading=', loading, 'user=', user);

    const login = async (email, password) => {
        //console.log('AuthContext: Login function called.');
        try {
            const response = await directusApi.post('/auth/login', { email, password });
            
            const accessToken = response.data.data.access_token;
            const refreshToken = response.data.data.refresh_token;

            localStorage.setItem('directus_token', accessToken);
            localStorage.setItem('directus_refresh_token', refreshToken);

            const currentUserResponse = await directusApi.get('/users/me?fields=*,role.name');
            setIsAuthenticated(true);
            setUser(currentUserResponse.data.data);
            //console.log("AuthContext: Login successful! User:", currentUserResponse.data.data);
            return true;
        } catch (error) {
            console.error("AuthContext: Login failed:", error.response ? error.response.data : error.message);
            resetAuthState(); // <-- Call reset function on login failure
            return false;
        }
    };

    const logout = async () => {
        //console.log('AuthContext: Logout function called.');
        try {
            const refreshToken = localStorage.getItem('directus_refresh_token');
            if (refreshToken) {
                 await directusApi.post('/auth/logout', { refresh_token: refreshToken });
            }
            resetAuthState(); // <-- Call reset function on logout
            //console.log("AuthContext: Logged out successfully.");
        } catch (error) {
            console.error("AuthContext: Logout failed:", error.response ? error.response.data : error.message);
            // Even if logout API call fails, we still want to reset client-side state
            resetAuthState();
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);