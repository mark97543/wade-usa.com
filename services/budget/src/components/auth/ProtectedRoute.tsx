import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/atoms/Spinner/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isLoading, hasRole } = useAuth();
  const location = useLocation();

  // DEBUG LOGS
  if (isLoading) {
     console.log(`🛡️ [ProtectedRoute] Loading... (${location.pathname})`);
     return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}><Spinner /></div>;
  }

  if (!user) {
    console.warn(`⛔ [ProtectedRoute] Access Denied. No User found. Redirecting to /login.`);
    console.warn(`   -> Current Path: ${location.pathname}`);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    console.warn(`⛔ [ProtectedRoute] Access Denied. Role Mismatch.`);
    console.warn(`   -> Required: ${requiredRole}`);
    console.warn(`   -> User Role: ${user.role?.id}`);
    return <Navigate to="/unauthorized" replace />;
  }

  console.log(`🔓 [ProtectedRoute] Access Granted to ${location.pathname}`);
  return <>{children}</>;
};