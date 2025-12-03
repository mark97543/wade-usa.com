//#region  --- IMPORTS ---
import { useMemo } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// --- PAGES ---
import  NotFound  from './pages/404';
import Landing from './pages/Landing';
import UnauthorizedPage from './pages/UnauthorizedPage';
import Dash from './pages/Dash';

// --- COMPONENTS ---
import { Login } from '@/pages/Login';
import { Header } from '@/components/organisms/Header/Header';
import type { NavItem } from '@/components/organisms/Header/types';
import {Showcase} from '@/pages/Showcase';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// --- CONTEXT ---
import { useAuth } from '@/context/AuthContext';
//#endregion

//#region  --- CONFIGURATION ---
// 1. Define Roles (Ensure these match your Directus UUIDs)
const ROLES = {
  ADMIN: import.meta.env.VITE_ROLE_ADMIN || 'admin-uuid-placeholder',
  BASIC: import.meta.env.VITE_ROLE_BASIC || 'basic-uuid-placeholder',
  PENDING: import.meta.env.VITE_ROLE_PENDING || 'pending-uuid-placeholder',
};
//#endregion

//#region  --- HELPER FUNCTIONS (Logic Layer) ---

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

  //#region ---GUI and Secutity
  const { user, logout } = useAuth();
  // 1. Get the Safe Role ID
  const userRoleId = getRoleId(user);
  // 2. Define the Master Menu (Contains ALL links for ALL users)
  // We use useMemo so we don't recreate this array on every render
  const masterMenu: NavItem[] = useMemo(() => [

  ], []);
  // 3. Calculate the "Visible Menu"
  // This runs whenever the user logs in/out or changes roles
  const visibleMenu = useMemo(() => {
    return filterMenuByRole(masterMenu, userRoleId);
  }, [masterMenu, userRoleId]);
  // 4. Prepare User object for Header
  const headerUser = user ? {
    name: user.first_name || 'User',
    email: user.email,
    isAdmin: userRoleId === ROLES.ADMIN,
    roleId: userRoleId
  } : null;
  //#endregion


  return (
    <>
      {/* Header receives the pre-filtered 'visibleMenu' */}
      <Header 
        siteName="Wade USA"
        // logoUrl="/assets/logo.png"
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

          {/* --- admin and basic --- */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.BASIC]} />}>
            <Route path="/dashboard" element={<Dash />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

export default App;