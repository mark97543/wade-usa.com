import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/atoms/Spinner/Spinner';

interface ProtectedRouteProps {
  allowedRoles?: string[]; // Array of Role IDs allowed to see this page
}

export const ProtectedRoute = ({ allowedRoles = [] }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 1. Loading State
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <Spinner />
      </div>
    );
  }

  // 2. Auth Check
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Role Check
  if (allowedRoles.length > 0) {
    // Directus sometimes returns role as an object { id: "..." } or just a string "..."
    const userRoleId = typeof user.role === 'object' && user.role !== null
        ? user.role.id 
        : user.role;

    if (!userRoleId || !allowedRoles.includes(userRoleId)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // 4. Render the Child Route
  return <Outlet />;
};