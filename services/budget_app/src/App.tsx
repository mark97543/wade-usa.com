import { useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';

// --- COMPONENTS ---
import Landing from '@/pages/Landing'; 
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'; 
import { Header } from '@/components/organisms/Header/Header';
import type { NavItem } from '@/components/organisms/Header/types';

// --- CONTEXT & CONFIG ---
import { useAuth } from '@/context/AuthContext';
import { ROLES } from '@/lib/directus'; 

export const LOGIN_URL = import.meta.env.PROD 
  ? 'https://wade-usa.com/login'
  : 'https://localhost:3000/login';

export const HOME_URL = import.meta.env.PROD 
  ? 'https://wade-usa.com/dashboard'
  : 'https://localhost:3000/dashboard';


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
    { label: 'Home', path: HOME_URL },

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
        siteName="M&S"
        mainNav={visibleMenu} 
        user={headerUser}
        onLogout={logout}
        onLogin={() => window.location.href = LOGIN_URL}
      />

      <main style={{ minHeight: '80vh' }}>
        <Routes>

          {/* TODO: UNCOMMENT FOR PRODUCTION */}
          {/* <Route path="/" element={<ProtectedRoute><Landing /></ProtectedRoute>} /> */} 
          {/* Development only Comment for production */}
          <Route path="/" element={<Landing />} /> 

          {/* --- FALLBACK --- */}
          <Route path="*" element={<div className="p-8">404 - Page Not Found</div>} />
        </Routes>
      </main>
    </>
  );
}

export default App;