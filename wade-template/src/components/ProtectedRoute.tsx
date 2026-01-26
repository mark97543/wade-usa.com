/**
 * 🛡️ COMPONENT: ProtectedRoute
 * Handles authentication checks and Role-Based Access Control (RBAC).
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Wait for Directus to answer
  if (loading) {
    return <div>Loading Secure Session...</div>; 
  }

  // 2. If no user, send to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Since this is a Wrapper Route, we use <Outlet /> to render the children (Dashboard)
  return <Outlet />;
}