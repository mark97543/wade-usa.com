import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';


export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    //console.log(user)

    if (loading) {
        return <div>Checking authentication...</div>;
    }

    if (!user) {
        // If the user is not logged in, redirect to the login page as before.
        return <Navigate to="/login" replace />;
    }

    // 1. Check if the user's role is "Pending"
    if (user.role && user.role.name === 'Pending') {
        // If they are pending, redirect them to the pending approval page.
        return <Navigate to="/pending-approval" replace />;
    }

    // 2. If allowedRoles is provided, check if the user has permission
    if (allowedRoles && !allowedRoles.includes(user.role.name)) {
        // If the user's role is not in the allowed list, show your custom Forbidden page.
        return <Navigate to="/forbidden" replace />;
    }

    // If all checks pass, render the page they were trying to access.
    return children;
};