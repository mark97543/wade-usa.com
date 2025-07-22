import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import Forbbiden from '../../features/home/src/forbidden/Forbbiden'; // We'll show this if the role is wrong

/**
 * A protected route that checks for both authentication and user role.
 * @param {object} props
 * @param {React.ReactNode} props.children - The component to render if authorized.
 * @param {string[]} props.allowedRoles - An array of role names that are allowed to access this route.
 */
export const RoleProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading, isLoggedIn } = useAuth();

    // While we're checking for a user, we can show a loading indicator
    if (loading) {
        return <div>Checking authentication...</div>; 
    }

    // If the user is not logged in at all, send them to the login page
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // If the user is logged in, but their role is NOT in the allowed list, show a forbidden page
    // We use optional chaining `user?.role?.name` to prevent errors
    if (!allowedRoles.includes(user?.role?.name)) {
        return <Forbbiden />;
    }

    // If the user is logged in AND has the correct role, render the page they were trying to access
    return children;
};

// Also, let's export it from the main index file for easy access