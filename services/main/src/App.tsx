//App.tsx
// ===============================================================
// Imports
// ===============================================================
//#region
import { useMemo, useEffect } from 'react';
import { Routes, Route} from 'react-router-dom';
import { Login } from '@/pages/Login';
import Landing from './pages/Landing'; 
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Header } from '@/components/organisms/Header/Header';
import type { NavItem } from '@/components/organisms/Header/types';
import {Showcase} from '@/pages/Showcase';
import { useAuth } from '@/context/AuthContext';
import Dashboard from '@/pages/Dashboard';
import Pending from '@/pages/Pending';
import { useNavigate, useLocation } from 'react-router-dom';
import Unauthorized from '@/pages/Unauthorized';
//#endregion

// --- CONFIGURATION ---
// Define Roles
// Remove the manual const ROLES definition.
// Import ROLES from your centralized directus file instead:
import { ROLES } from '@/lib/directus';
console.log

//#endregion

// --- CONFIGURATION ---
// Define Roles
// Using imported ROLES from directus.ts

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


function App() {
  const { user, logout } = useAuth();
  const userRoleId = getRoleId(user);
  const navigate = useNavigate();
  const location = useLocation();

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

  // --- THE PENDING JAIL ---
  useEffect(() => {
    // 1. If user is logged in
    // 2. AND their role is PENDING
    // 3. AND they are NOT already on the pending page (or login/logout)
    if (userRoleId === ROLES.PENDING) {
      const allowedPaths = ['/pending', '/login', '/logout'];
      
      if (!allowedPaths.includes(location.pathname)) {
        navigate('/pending', { replace: true });
      }
    }
  }, [userRoleId, location.pathname, navigate]);

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
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/showcase" element={<Showcase />} />

          {/* --- LEVEL 1: ALL LOGGED IN (Including Pending) --- */}
          <Route element={<ProtectedRoute />}> 
            <Route path="/pending" element={<Pending />} />
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