import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from './AuthContext.jsx'; // Importing AuthContext to access authentication state

const ProtectedRoute =({allowedRoles}) => {
    const {isAuthenticated, user, loading} = useAuth(); // Destructuring authentication state from AuthContext

    if(loading){
        //TODO: make Loading Screen
        return <div>Loading...</div>; // Placeholder for loading state
    }

    if(!isAuthenticated){
        // If not authenticated, redirect to login page
        return <Navigate to="/login" replace />;
    }


    // Optional: Role-based access control (for later, if needed)
    // If allowedRoles are specified AND the user's role is NOT in allowedRoles, redirect to unauthorized
    // if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    //     return <Navigate to="/unauthorized" replace />;
    // }

    // User is authenticated (and authorized if roles checked), render the content
    return <Outlet />;// <-- This is what renders the protected DashboardPage
};

export default ProtectedRoute;