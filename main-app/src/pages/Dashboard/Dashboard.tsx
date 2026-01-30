// wade-template/src/pages/Dashboard/Dashboard.tsx

/**
 * 📊 DASHBOARD PAGE
 * ---------------------------------------------------------------------
 * Purpose: The main landing area for logged-in users.
 * Features:
 * - Protected by Auth (User must be logged in).
 * - Uses GlobalContext to set the Page Title.
 * - Uses ThemeContext to toggle Dark Mode.
 * ---------------------------------------------------------------------
 */

import { useEffect } from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { CONFIG } from '../../config/layout';


export default function Dashboard() {

  // const { theme, toggleTheme } = useTheme();
  const { setPageTitle } = useGlobal(); // <--- Use Global State

  // 1. Prove we can set the title globally on mount
  useEffect(() => {
    setPageTitle(CONFIG.APP_NAME);
  }, []);


  return (
    <>
      <div>Dashboard</div>

    </>
  );
}