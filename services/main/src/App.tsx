//App.tsx
// ===============================================================
// Imports
// ===============================================================
//#region
import { useMemo } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Login } from '@/pages/Login';
import Landing from './pages/Landing'; 
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Header } from '@/components/organisms/Header/Header';
import { Button } from '@/components/atoms/Button/Button';
import type { NavItem } from '@/components/organisms/Header/types';
import {Showcase} from '@/pages/Showcase';
import { useAuth } from '@/context/AuthContext';
import Dashboard from '@/pages/Dashboard';

// --- CONFIGURATION ---
// Define Roles
const ROLES = {
  ADMIN: import.meta.env.VITE_ROLE_ADMIN || 'admin-uuid-placeholder',
  BASIC: import.meta.env.VITE_ROLE_BASIC || 'basic-uuid-placeholder',
  PENDING: import.meta.env.VITE_ROLE_PENDING || 'pending-uuid-placeholder',
};

//#endregion

// ===============================================================
// HELPER FUNCTIONS 
// ===============================================================
//#region
/**
 * Safely extracts the Role ID from a User object, 
 * handling cases where Directus returns a string OR an object.
 */
const getRoleId = (user: any): string | null => {
  if (!user || !user.role) return null;
  return typeof user.role === 'object' ? user.role.id : user.role;
};

/**
 * Recursively filters the menu tree.
 * - Removes items the user isn't allowed to see.
 * - Recursively cleans up children dropdowns.
 */
const filterMenuByRole = (items: NavItem[], userRoleId: string | null): NavItem[] => {
  return items.reduce((acc: NavItem[], item) => {
    // A. Check Permission for this specific item
    // If allowedRoles exists AND user's ID isn't in it -> Skip this item
    if (item.allowedRoles && item.allowedRoles.length > 0) {
      if (!userRoleId || !item.allowedRoles.includes(userRoleId)) {
        return acc; // User not allowed, skip.
      }
    }

    // B. Create a Shallow Copy (So we don't mutate the original master menu)
    const newItem = { ...item };

    // C. Filter Children (Recursion)
    if (newItem.children && newItem.children.length > 0) {
      newItem.children = filterMenuByRole(newItem.children, userRoleId);
      
      // Optional: If a dropdown becomes empty after filtering, you might want to hide it?
      // if (newItem.children.length === 0) return acc; 
    }

    // D. Add to result
    acc.push(newItem);
    return acc;
  }, []);
};
//#endregion

// ===============================================================
// PLACEHOLDER PAGES (These will Get Deleted as They are built)
// ===============================================================

const UnauthorizedPage = () => (
  <div style={{ padding: '4rem', textAlign: 'center' }}>
    <h1>403 - Access Denied</h1>
    <Link to="/"><Button>Go Home</Button></Link>
  </div>
);


function App() {
  const { user, logout } = useAuth();

  // 1. Get the Safe Role ID
  const userRoleId = getRoleId(user);

  // --------------------------------------------------
  // The menu for the header. (See Template for Format)
  // --------------------------------------------------
  //#region
  const masterMenu: NavItem[] = useMemo(() => [

  ], []);

  //#endregion

  // Calculate the "Visible Menu". This runs whenever the user logs in/out or changes roles
  const visibleMenu = useMemo(() => {
    return filterMenuByRole(masterMenu, userRoleId);
  }, [masterMenu, userRoleId]);

  // Prepare User object for Header
  const headerUser = user ? {
    name: user.first_name || 'User',
    email: user.email,
    isAdmin: userRoleId === ROLES.ADMIN,
    roleId: userRoleId
  } : null;

  return (
    <>
      {/* Header receives the pre-filtered 'visibleMenu' */}
      <Header 
        siteName="M&S"
        //logoUrl="/assets/logo.png"
        mainNav={visibleMenu} 
        user={headerUser}
        onLogout={logout}
        onLogin={() => window.location.href = '/login'}
      />

      <main style={{ minHeight: '80vh' }}>
        <Routes>
          {/* --- PUBLIC --- */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/showcase" element={<Showcase />} />

          {/* --- LEVEL 1: ALL LOGGED IN (Including Pending) --- */}
          <Route element={<ProtectedRoute />}> 

          </Route>

          {/* --- LEVEL 2: BASIC & ADMIN (Pending Blocked) --- */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.BASIC, ROLES.ADMIN]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* --- LEVEL 3: ADMIN ONLY --- */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>

          </Route>

          {/* Catch-all */}
          <Route path="*" element={<div className="p-8">404 - Page Not Found</div>} />
        </Routes>
      </main>
    </>
  );
}

export default App;