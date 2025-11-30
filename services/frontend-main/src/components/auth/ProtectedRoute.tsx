import type { ReactNode } from 'react'; // Keep ReactNode import
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/atoms/Spinner/Spinner';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  // Use isAuthenticated to clearly check if the user is logged in
  const { user, isLoading, isAuthenticated } = useAuth(); 
  const location = useLocation();

  // 1. If still checking the session, show a full-screen spinner.
  if (isLoading) {
    return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Spinner size="lg" /> 
        </div>
    );
  }

  // 2. If checking is done AND user is not authenticated, redirect.
  if (!isAuthenticated) {
    // Redirect them to the /login page, saving the location they were trying to reach.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Authenticated: Render the protected content.
  return children;
};