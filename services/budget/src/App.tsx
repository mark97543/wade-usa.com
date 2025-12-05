import { useMemo, useEffect } from 'react'; // Added useEffect
import { Route, Routes, Navigate } from 'react-router-dom'; // Added Navigate

// --- COMPONENTS ---
import { Header } from '@/components/organisms/Header/Header';
import type { NavItem } from '@/components/organisms/Header/types';

// --- PAGES ---
import BudgetMain from '@/pages/BudgetMain';

// --- CONTEXT ---
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'; // Fixed import path

//#region --- CONFIGURATION ---
const ROLES = {
  ADMIN: import.meta.env.VITE_ROLE_ADMIN || 'admin-uuid-placeholder',
  BASIC: import.meta.env.VITE_ROLE_BASIC || 'basic-uuid-placeholder',
  PENDING: import.meta.env.VITE_ROLE_PENDING || 'pending-uuid-placeholder',
};
//#endregion

//#region -- Helper Functions --
const getRoleId = (user: any): string | null => {
  if (!user || !user.role) return null;
  return typeof user.role === 'object' ? user.role.id : user.role;
};

const filterMenuByRole = (items: NavItem[], userRoleId: string | null): NavItem[] => {
  return items.reduce((acc: NavItem[], item) => {
    if (item.allowedRoles && item.allowedRoles.length > 0) {
      if (!userRoleId || !item.allowedRoles.includes(userRoleId)) {
        return acc;
      }
    }
    const newItem = { ...item };
    if (newItem.children && newItem.children.length > 0) {
      newItem.children = filterMenuByRole(newItem.children, userRoleId);
    }
    acc.push(newItem);
    return acc;
  }, []);
};
//#endregion

// --- NEW COMPONENT: Redirect Bridge ---
// This acts as a portal. If the router sends you here, it immediately kicks you
// to the MAIN website to log in.
const RedirectToMainLogin = () => {
  useEffect(() => {
    // Force a full browser redirect to the main domain
    window.location.href = `${import.meta.env.VITE_APP_MAIN_URL}/login`;
  }, []);
  return null; // Render nothing while redirecting
};

function App() {
  //#region -- Security and header --
  const { user, logout } = useAuth();
  const userRoleId = getRoleId(user);

  const masterMenu: NavItem[] = useMemo(() => [
    // Link back to the main dashboard
    { label: 'Dashboard', path: `${import.meta.env.VITE_APP_MAIN_URL}/dashboard`}, 
  ], []);

  const visibleMenu = useMemo(() => {
    return filterMenuByRole(masterMenu, userRoleId);
  }, [masterMenu, userRoleId]);

  const headerUser = user ? {
    name: user.first_name || 'User',
    email: user.email,
    isAdmin: userRoleId === ROLES.ADMIN,
    roleId: userRoleId
  } : null;
  //#endregion

  return (
    <>
      <Header 
        siteName="Wade USA Budget"
        mainNav={visibleMenu} 
        user={headerUser}
        onLogout={logout}
        // Manual login click handling
        onLogin={() => window.location.href = `${import.meta.env.VITE_APP_MAIN_URL}/login`}
      />

      <main style={{ minHeight: '80vh' }}>
        <Routes>
          {/* --- PROTECTED APP ROUTES --- */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.BASIC]} />}>
            <Route path="/" element={<BudgetMain />} />
          </Route>

          {/* --- THE FIX: MISSING BRIDGE ROUTES --- */}
          
          {/* 1. The Trap Door: Catches the redirect from ProtectedRoute */}
          <Route path="/login" element={<RedirectToMainLogin />} />

          {/* 2. Access Denied Page */}
          <Route path="/unauthorized" element={
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <h1>403 - Access Denied</h1>
              <p>You do not have permission to view the Budget App.</p>
              <a 
                href={import.meta.env.VITE_APP_MAIN_URL}
                style={{ color: 'var(--accent-color)', textDecoration: 'underline' }}
              >
                Go Back Home
              </a>
            </div>
          } />

          {/* 3. Catch-All (404) -> Send them home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes> 
      </main>
    </>
  );
}

export default App;