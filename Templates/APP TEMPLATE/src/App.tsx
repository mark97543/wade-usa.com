import { useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';

// --- COMPONENTS ---
import { Login } from '@/pages/Login';
import Landing from '@/pages/Landing'; 
import { Showcase } from '@/pages/Showcase';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'; // <--- Simple version
import { Header } from '@/components/organisms/Header/Header';
import type { NavItem } from '@/components/organisms/Header/types';

// --- CONTEXT & CONFIG ---
import { useAuth } from '@/context/AuthContext';
import { ROLES } from '@/lib/directus'; 

// ==========================================
// HELPER: UI MENU FILTER
// (This hides links in the visual menu, but doesn't block the route)
// ==========================================
const filterMenuByRole = (items: NavItem[], userRoleId: string | undefined): NavItem[] => {
  return items.reduce((acc: NavItem[], item) => {
    // Check Permission (If item has roles, and user doesn't match, skip it)
    if (item.allowedRoles && item.allowedRoles.length > 0) {
      if (!userRoleId || !item.allowedRoles.includes(userRoleId)) {
        return acc; 
      }
    }
    // Clone & Recurse for Dropdowns
    const newItem = { ...item };
    if (newItem.children && newItem.children.length > 0) {
      newItem.children = filterMenuByRole(newItem.children, userRoleId);
    }
    acc.push(newItem);
    return acc;
  }, []);
};

// ==========================================
// MAIN APP COMPONENT
// ==========================================
function App() {
  const { user, logout } = useAuth();

  // 1. Define Master Menu
  const masterMenu: NavItem[] = useMemo(() => [
    { label: 'Home', path: '/' },
    { label: 'Showcase', path: '/showcase' },

    // Everyone logged in sees Dashboard
    { 
      label: 'Dashboard', 
      path: '/dashboard',
      // We can use this to hide the LINK for public users, 
      // even if the Route doesn't enforce it yet.
      allowedRoles: [ROLES.BASIC, ROLES.ADMIN, ROLES.PENDING] 
    },

    // Only Admin sees this link
    { 
      label: 'Admin', 
      allowedRoles: [ROLES.ADMIN], 
      children: [
        { label: 'Settings', path: '/admin-settings' },
        { label: 'Users', path: '/admin-users' },
      ] 
    }
  ], []);

  // 2. Calculate Visible Menu
  const visibleMenu = useMemo(() => {
    return filterMenuByRole(masterMenu, user?.role);
  }, [masterMenu, user?.role]);

  // 3. Prepare Header User Data
  const headerUser = user ? {
    name: user.first_name || 'User',
    email: user.email,
    isAdmin: user.role === ROLES.ADMIN,
    roleId: user.role || null
  } : null;

  return (
    <>
      <Header 
        siteName="Wade USA"
        mainNav={visibleMenu} 
        user={headerUser}
        onLogout={logout}
        onLogin={() => window.location.href = '/login'}
      />

      <main style={{ minHeight: '80vh' }}>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/showcase" element={<Showcase />} />

          {/* --- PROTECTED ROUTES (Simple Check) --- */}
          
          {/* Dashboard: Protected, but allows all logged-in users */}
          {/* <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          /> */}

          {/* Pending: Protected */}
          {/* <Route 
            path="/pending" 
            element={
              <ProtectedRoute>
                <Pending />
              </ProtectedRoute>
            } 
          /> */}

          {/* Admin Settings: Protected (Logic inside component will hide content) */}
          <Route 
            path="/admin-settings" 
            element={
              <ProtectedRoute>
                <div className="p-8 text-red-700">Admin Settings Panel</div>
              </ProtectedRoute>
            } 
          />

          {/* --- FALLBACK --- */}
          <Route path="*" element={<div className="p-8">404 - Page Not Found</div>} />
        </Routes>
      </main>
    </>
  );
}

export default App;