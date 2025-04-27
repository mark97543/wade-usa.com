// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the custom hook

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth(); // Get state from context
  const location = useLocation(); // Get current location

  // 1. If still loading the initial auth state, show a loading indicator
  if (isLoading) {
    // Replace with a proper loading spinner/component later
    return <div>Loading...</div>;
  }

  // 2. If not loading and not authenticated, redirect to login
  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to in `state`. This allows redirecting back after login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. If not loading and authenticated, render the child component
  return children;
};

export default ProtectedRoute;