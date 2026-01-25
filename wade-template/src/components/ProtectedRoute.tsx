/**
 * 🛡️ PROTECTED ROUTE BOUNCER
 * ---------------------------------------------------------------------
 * Purpose: Guard specific routes from unauthorized access.
 * * Logic:
 * 1. While Loading: Shows a temporary "Checking Badge" state.
 * 2. If Guest: Redirects to the configured TOP_PAGE (usually /login).
 * 3. If Logged In: Checks if the User's Role is in the 'allowedRoles' list.
 * 4. If Authorized: Renders the child routes via <Outlet />.
 * ---------------------------------------------------------------------
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CONFIG } from '../config/layout';

interface Props {
  allowedRoles?: string[]; // Optional: List of Role IDs allowed to enter
}

export default function ProtectedRoute({ allowedRoles }: Props) {
  const { user, loading } = useAuth();

  // Show a clean loading state while AuthContext finishes the checkSession
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: 'var(--primary-color)' 
      }}>
        Checking Badge...
      </div>
    );
  }

  // 1. Not logged in? -> Kick to the configured Top Page (e.g., /login)
  if (!user) {
    return <Navigate to={CONFIG.TOP_PAGE} replace />;
  }

  // 2. Logged in, but wrong Role? -> Kick back to the main app dashboard
  // This allows you to restrict "Admin" pages from "Standard" users.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.warn(`User role [${user.role}] not authorized for this route.`);
    return <Navigate to="/" replace />; 
  }

  // 3. Allowed! -> Show the nested pages
  return <Outlet />;
}