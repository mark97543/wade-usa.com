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
import Colors from './Parts/Colors'
import ButtonShowcase from './Parts/ButtonShowcase';
import MenuShowcase from './Parts/MenuShowcase';
import InputShowcase from './Parts/InputShowcase';

export default function Dashboard() {

  // const { theme, toggleTheme } = useTheme();
  const { setPageTitle } = useGlobal(); // <--- Use Global State

  // 1. Prove we can set the title globally on mount
  useEffect(() => {
    setPageTitle('Dashboard Home');
  }, []);


  return (
    <>
      <Colors/>
      <ButtonShowcase/>
      <MenuShowcase/>
      <InputShowcase/>

    </>
  );
}