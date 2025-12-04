import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: string[]; // Array of Role IDs allowed to see this page
}

export const ProtectedRoute = ({ allowedRoles = [] }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 1. Loading State
  // Don't kick the user out while we are still asking the server "Who is this?"
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        Loading permissions...
      </div>
    );
  }

  // 2. Auth Check
  // If not logged in, send them to Login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Role Check (The Crash-Proof Fix)
  if (allowedRoles.length > 0) {
    
    // LOGIC: Directus might return 'role' as a string ("UUID") OR an object ({ id: "UUID" })
    // We check both possibilities to prevent the "reading 'id' of undefined" crash.
    const userRoleId = 
      typeof user.role === 'object' && user.role !== null
        ? user.role.id     // It's an object, grab .id
        : user.role;       // It's likely just the string UUID

    // If we can't find an ID, or the ID isn't in the allowed list -> Access Denied
    if (!userRoleId || !allowedRoles.includes(userRoleId)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // 4. If all checks pass, show the page
  return <Outlet />;
};