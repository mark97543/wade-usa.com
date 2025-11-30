import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '@/pages/Login';
import { Showcase } from '@/pages/Showcase';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/atoms/Button/Button';

import { useAuth } from '@/context/AuthContext';

// Placeholder Dashboard (We will move this to its own file later)
const Dashboard = () => {
  const { logout } = useAuth();
  
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <p>Welcome! You are logged in.</p>
      <Button onClick={logout} variant="danger">
        Logout
      </Button >
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/design" element={<Showcase />} />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
