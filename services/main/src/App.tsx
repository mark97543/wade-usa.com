//App.tsx

// ===============================================================
// Imports
// ===============================================================
//#region
import { useMemo } from 'react';
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
import Unauthorized from '@/pages/Unauthorized';
import Page404 from './pages/404Page';
import { Register } from './pages/Registration';

// --- CONFIGURATION ---
// Define Roles
// Remove the manual const ROLES definition.
// Import ROLES from your centralized directus file instead:
import { ROLES } from '@/lib/directus';

export const BUDGET_URL = import.meta.env.PROD 
  ? 'https://budget.wade-usa.com/'
  : 'https://localhost:3001/';

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
    
    // --- RESTORED LOGIC START ---
    // A. Check Permission for this specific item
    // If allowedRoles exists AND user's ID isn't in it -> Skip this item
    if (item.allowedRoles && item.allowedRoles.length > 0) {
      if (!userRoleId || !item.allowedRoles.includes(userRoleId)) {
        return acc; // User not allowed, skip.
      }
    }
    // --- RESTORED LOGIC END ---

    // B. Create a Shallow Copy
    const newItem = { ...item };

    // C. Filter Children (Recursion)
    if (newItem.children && newItem.children.length > 0) {
      newItem.children = filterMenuByRole(newItem.children, userRoleId);
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

  // --------------------------------------------------
  // The menu for the header. (See Template for Format)
  // --------------------------------------------------
  //#region
  const masterMenu: NavItem[] = useMemo(() => [
    { label: 'Budget', path:BUDGET_URL, allowedRoles: [ROLES.ADMIN, ROLES.BASIC]}
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
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/showcase" element={<Showcase />} />
          <Route path='/register' element={<Register />} />

          {/* --- PROTECTED --- */} 
          <Route path="/pending" element={<ProtectedRoute><Pending /></ProtectedRoute>}/>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>

          {/* Catch-all */}
          <Route path="*" element={<Page404 />} />
        </Routes>
      </main>
    </>
  );
}

export default App;