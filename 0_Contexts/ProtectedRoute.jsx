import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from './AuthContext.jsx'; // Importing AuthContext to access authentication state

const pendingRole = import.meta.env.VITE_PENDING_USER; // Define the role name for pending users
const authorizedRole = import.meta.env.VITE_AUTHORIZED_USER; // Define the role name for authorized users
const administratorRole = import.meta.env.VITE_ADMIN_USER; // Define the role name for administrators

const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, user, loading } = useAuth(); // Destructuring authentication state from AuthContext

    if (loading) {
        // Show a simple loading message while checking auth status
        return <div>Loading...</div>; // Placeholder for loading state
    }

    // 1. Basic Authentication Check (UNCOMMENTED AND MOVED HERE)
    if (!isAuthenticated) {
        // If not authenticated, redirect to login page
        return <Navigate to="/login" replace />;
    }
    
    // Ensure user and user.role exist before checking role.name
    if (user && user.role) {
        // 2. Role-Based Redirection for 'Pending' Users
        if (user.role === pendingRole) {
            // If authenticated and role is 'Pending', redirect to the /pending page
            // unless they are already on the /pending page (to prevent infinite loops)
            if (window.location.pathname !== '/pending') {
                return <Navigate to="/pending" replace />;
            }
        }

        // 3. Role-Based Authorization for `allowedRoles` (e.g., Administrator, NTK)
        // This checks if the user's role is NOT in the allowedRoles for THIS specific route.
        //  console.log("User role:", user);
        //  console.log("Allowed roles for this route:", allowedRoles);
        if (allowedRoles && !allowedRoles.includes(user.role)) {
            // If authenticated but role is not allowed, redirect to /forbidden (or /unauthorized)
            // Ensure they are not already on the /forbidden page (to prevent infinite loops)
            if (window.location.pathname !== '/forbidden') { // Assuming /forbidden is your unauthorized page
                return <Navigate to="/forbidden" replace />;
            }
        }
    } else if (isAuthenticated && !user) {
        // Edge case: authenticated but user object is null/undefined (e.g., fetching failed)
        // This might indicate an issue with token validation or user fetch.
        // Redirect to login or an error page.
        console.warn("User is authenticated but user object is missing. Redirecting to login.");
        return <Navigate to="/login" replace />;
    }

    // If all checks pass (authenticated, not pending, and allowed role), render the content
    return <Outlet />; // This renders the component associated with the nested route (e.g., <Docker />)
};

export default ProtectedRoute;