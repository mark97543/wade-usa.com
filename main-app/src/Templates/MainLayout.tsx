/**
 * 🏗️ LAYOUT: MainLayout
 * ---------------------------------------------------------------------
 * The primary structural wrapper for the application.
 * * @description
 * This component defines the global "Frame" of the app. It:
 * 1. Persists the Header across all routes.
 * 2. Uses the <Body> component to center and pad page-specific content.
 * 3. Utilizes <Outlet> to render child routes dynamically.
 * ---------------------------------------------------------------------
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Page Components/Header/Header';
import Body from './Body'; 

const MainLayout = () => {
  return (
    <div className="layout-root">
      {/* The Header sits at the very top, full-width */}
      <Header />
      <Body>
        <Outlet />
      </Body>

      {/* Footer can be added here later */}
    </div>
  );
};

export default MainLayout;