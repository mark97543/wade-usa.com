import { useMemo, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

// --- COMPONENTS ---
import { Header } from '@/components/organisms/Header/Header';
import type { NavItem } from '@/components/organisms/Header/types';

// --- PAGES ---
import BudgetMain from '@/pages/BudgetMain'; 

// --- CONTEXT ---
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

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

// --- DEBUG COMPONENT: Redirect Paused ---
const RedirectToMainLogin = () => {
  useEffect(() => {
    // -----------------------------------------------------------
    // DEBUGGING STEP: Redirect is PAUSED.
    // This allows you to check the Network Tab for cookies.
    // -----------------------------------------------------------
    console.warn("⛔ RedirectToMainLogin Triggered: REDIRECT BLOCKED FOR DEBUGGING.");
    console.log("👉 ACTION REQUIRED: Open DevTools (F12) -> Network Tab.");
    console.log("👉 Look for the red 'me' request.");
    console.log("👉 Check 'Request Headers': Is the 'Cookie' header present?");
  }, []);

  return (
    <div style={{padding: '4rem', textAlign: 'center', backgroundColor: '#fff1f2', color: '#991b1b'}}>
      <h2>🛑 Debug Mode: Redirect Paused</h2>
      <p>The app wants to redirect you to <code>/login</code>, but we stopped it.</p>
      <hr style={{margin: '1rem 0', borderColor: '#fca5a5'}}/>
      <div style={{textAlign: 'left', maxWidth: '500px', margin: '0 auto'}}>
        <strong>Check your Network Tab now:</strong>
        <ol>
            <li>Look for the failed request (401 Unauthorized).</li>
            <li>Click it and view <strong>Request Headers</strong>.</li>
            <li>Look for <code>Cookie: directus_refresh_token=...</code></li>
        </ol>
        <p>
            If the cookie is <strong>MISSING</strong>: Your browser blocked it (Domain mismatch).<br/>
            If the cookie is <strong>PRESENT</strong>: The Server rejected it (CORS/Config issue).
        </p>
      </div>
      <br />
      <button 
        onClick={() => window.location.href = `${import.meta.env.VITE_APP_MAIN_URL}/login`}
        style={{padding: '1rem', cursor: 'pointer', fontWeight: 'bold'}}
      >
        Manual Continue to Login
      </button>
    </div>
  );
};

function App() {
  //#region -- Security and header --
  const { user, logout, isLoading } = useAuth();
  const userRoleId = getRoleId(user);

  // --- DEBUGGING LOGS ---
  useEffect(() => {
    console.group("🔍 Budget App Debugger");
    console.log("1. Auth Loading State:", isLoading);
    console.log("2. Current User Object:", user);
    console.log("3. Extracted Role ID:", userRoleId);
    console.log("4. Env - Main URL:", import.meta.env.VITE_APP_MAIN_URL);
    
    if (!isLoading && !user) {
        console.warn("⚠️ No User found. Rendering <RedirectToMainLogin />");
    }
    console.groupEnd();
  }, [user, isLoading, userRoleId]);
  // ----------------------

  const masterMenu: NavItem[] = useMemo(() => [
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

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>Loading Session...</div>;
  }

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

          {/* --- BRIDGE ROUTES --- */}
          <Route path="/login" element={<RedirectToMainLogin />} />

          <Route path="/unauthorized" element={
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <h1>403 - Access Denied</h1>
              <p>You do not have permission to view the Budget App.</p>
              <p style={{fontSize: '0.8rem', opacity: 0.7, marginTop: '1rem'}}>
                Current Role: {userRoleId || 'None'}
              </p>
              <a 
                href={import.meta.env.VITE_APP_MAIN_URL}
                style={{ color: 'var(--accent-color)', textDecoration: 'underline' }}
              >
                Go Back Home
              </a>
            </div>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes> 
      </main>
    </>
  );
}

export default App;