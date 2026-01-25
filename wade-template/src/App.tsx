// /root/projects/wade-template/src/App.tsx

/**
 * Main Application Shell
 * ----------------------
 * Currently acting as a "Smoke Test" for our Auth System.
 * It uses the 'useAuth' hook to display different UI based on login status.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './Templates/MainLayout'; 
import { CONFIG } from './config/layout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- GLOBAL WRAPPER: Header & Body on ALL pages --- */}
        <Route element={<MainLayout />}>
          
          {/* Public Page (Now includes Header) */}
          <Route path="/login" element={<Login />} />

          {/* 🛡️ Protected Pages */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            {/* Add future protected pages here */}
          </Route>

          {/* Catch-all redirects back to Dashboard (or Login if not auth'd) */}
          <Route path="*" element={<Navigate to={CONFIG.TOP_PAGE} replace />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}