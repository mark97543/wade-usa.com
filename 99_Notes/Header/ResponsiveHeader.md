# Responsive Header with Imported Hamburger Component (`<Ham />`)

**Goal:** Implement a common responsive navigation pattern where a full navigation bar collapses into an imported `<Ham />` component (your hamburger menu icon) on smaller screens. The `<Ham />` component should only be visible when the menu is collapsed, and the navigation links should expand when clicked.

* * *

### **Overview of the Approach**

This pattern integrates a dedicated Hamburger component (`<Ham />`) into the responsive header, leveraging:

1.  **HTML Structure (Header Component JSX):**
    - Contains the primary navigation links.
    - Includes the imported `<Ham />` component.
2.  **CSS (Header Component CSS File):**
    - **Default Styles:** For the expanded (large screen) navigation, where the `<Ham />` component is hidden.
    - **Media Queries (`@media` rules):** Apply styles when the screen width is below a certain breakpoint.
        - On small screens: Hide the direct navigation links, show the `<Ham />` component.
        - On large screens: Show the navigation links, hide the `<Ham />` component.
3.  **JavaScript (Header Component Logic & Ham Component Logic):**
    - **`Header` Component:** Manages the overall mobile menu's open/closed state. Passes this state and a toggle function to the `<Ham />` component.
    - **`<Ham />` Component:** Receives the open/closed state and toggle function as props. Renders the actual hamburger bars and handles clicks to toggle the menu. It will contain its own internal CSS for bar styling and animation.

* * *

### **Step-by-Step Implementation**

#### **Phase 1: Create the `<Ham />` Component (`Ham.jsx`)**

This is the self-contained component for your hamburger icon and its animation.

1.  **Create a new file for your `Ham` component:** This typically resides in `YourReactApp/src/components/Ham/Ham.jsx` (or a similar path you prefer for shared components).
2.  **Create a corresponding CSS file:** `YourReactApp/src/components/Ham/Ham.css`.
3.  **Paste the code below into `Ham.jsx`:**

JavaScript

```
// YourReactApp/src/components/Ham/Ham.jsx (or similar path)
import React from 'react';
import './Ham.css'; // Dedicated CSS for the Ham component

const Ham = ({ isMenuOpen, onToggle }) => {
  return (
    // The main container for the hamburger icon
    // Apply 'menu-open' class based on prop for animation/styling
    <div className={`ham-container ${isMenuOpen ? 'menu-open' : ''}`} onClick={onToggle}>
      <div className='ham-bar'></div>
      <div className='ham-bar'></div>
      <div className='ham-bar'></div>
    </div>
  );
};

export default Ham;
```

4.  **Paste the code below into `Ham.css`:**

CSS

```
/* YourReactApp/src/components/Ham/Ham.css (or similar path) */

.ham-container {
  display: flex; /* Initially flex for layout purposes */
  cursor: pointer;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 25px;
  padding: 0.5rem;
  z-index: 100; /* Ensure it's above other content when visible */
  /* Hide by default, will be shown by media query in Header.css */
  /* Overridden by Header.css media query */
}

.ham-bar {
  width: 100%;
  height: 3px;
  background-color: white; /* Example bar color */
  border-radius: 5px;
  transition: all 0.3s ease; /* For animation */
}

/* Optional: Animation for hamburger icon when active (menu-open) */
/* This transforms the bars into an 'X' */
.ham-container.menu-open .ham-bar:nth-child(2) {
  opacity: 0; /* Middle bar disappears */
}
.ham-container.menu-open .ham-bar:nth-child(1) {
  transform: translateY(9px) rotate(45deg); /* Top bar rotates and moves down */
}
.ham-container.menu-open .ham-bar:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg); /* Bottom bar rotates and moves up */
}
```

#### **Phase 2: HTML Structure (`Header.jsx`)**

Now, integrate the `<Ham />` component into your main `Header` component.

1.  **Create/Open your `Header.jsx` (or `.tsx`) file:** This file typically resides in `YourReactApp/src/components/Header/Header.jsx`.
2.  **Replace its content with the following generic structure.**

JavaScript

```
// YourReactApp/src/components/Header/Header.jsx (or similar path)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@contexts/AuthContext'; // If your app has authentication

import './Header.css'; // Make sure your CSS file is correctly imported
import Ham from './Ham'; // <--- IMPORT YOUR HAM COMPONENT HERE! (Adjust path if needed)

const appTitle = import.meta.env.VITE_APP_TITLE || 'Your App Name';

const Header = () => {
  const navigate = useNavigate();
  // const { isAuthenticated, logout } = useAuth(); // Uncomment if using authentication
  const isAuthenticated = false; // Placeholder for authentication state if not using useAuth yet

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State to toggle mobile menu

  // Close menu when navigating
  const handleNavLinkClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  }

  const handleLogin = () => { // Or handleAuthAction
    handleNavLinkClick('/login');
  }

  const handleLogout = () => { // Or handleAuthAction
    // logout(); // Call your logout function if using authentication
    handleNavLinkClick('/logout-success');
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen); // Toggle the menu state
  }

  return (
    <header className='header-container'>
      <div className='header-logo'>
        <a href='/' onClick={() => handleNavLinkClick('/')}>{appTitle}</a>
      </div>

      {/* The imported Ham component */}
      <Ham isMenuOpen={isMobileMenuOpen} onToggle={toggleMobileMenu} /> {/* <--- USE HAM COMPONENT HERE */}

      {/* Navigation links (conditionally rendered/styled) */}
      <nav className={`header-nav ${isMobileMenuOpen ? 'menu-open' : ''}`}>
        <ul>
          <li><a href='/' onClick={() => handleNavLinkClick('/')}>Home</a></li>
          <li><a href='/features' onClick={() => handleNavLinkClick('/features')}>Features</a></li>
          {isAuthenticated && (
            <li><a href='/dashboard' onClick={() => handleNavLinkClick('/dashboard')}>Dashboard</a></li>
          )}
          <li><a href='/about' onClick={() => handleNavLinkClick('/about')}>About</a></li>
          <li><a href='/contact' onClick={() => handleNavLinkClick('/contact')}>Contact</a></li>
          {isAuthenticated ? (
            <li><button className='nav-button logout-button' onClick={handleLogout}>Logout</button></li>
          ) : (
            <li><button className='nav-button login-button' onClick={handleLogin}>Login</button></li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
```

#### **Phase 3: CSS Styling (`Header.css`)**

This file defines the overall header layout and the media query that controls when the navigation collapses and the `<Ham />` component appears.

1.  **Create/Open your `Header.css` file:** This file typically resides in the same directory as your `Header.jsx`.
2.  **Replace its content with the following generic CSS.**

CSS

```
/* YourReactApp/src/components/Header/Header.css (or similar path) */

/* --- Base Styles (for all screen sizes, or large screens first) --- */
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #333;
  color: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  position: relative;
}

.header-logo a {
  color: white;
  text-decoration: none;
  font-size: 1.8rem;
  font-weight: bold;
}

.header-nav ul {
  display: flex; /* Displays links horizontally on large screens */
  list-style: none;
  margin: 0;
  padding: 0;
}

.header-nav ul li {
  margin-left: 2rem;
}

.header-nav ul li a,
.header-nav ul li button.nav-button {
  color: white;
  text-decoration: none;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s ease;
}

.header-nav ul li a:hover,
.header-nav ul li button.nav-button:hover {
  color: #00bcd4;
}

/* --- Media Queries (for small screens) --- */
@media (max-width: 768px) { /* Adjust this breakpoint as needed */

  /* Hide the regular desktop navigation */
  .header-nav {
    display: none; /* Hide the navigation links by default on small screens */
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: #444;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    z-index: 99;
  }

  /* Show the navigation when the menu is open (via JS class) */
  .header-nav.menu-open {
    display: flex; /* Show the menu as a column */
  }

  .header-nav ul {
    flex-direction: column;
    width: 100%;
    padding: 1rem 0;
  }

  .header-nav ul li {
    margin: 0;
    text-align: center;
    width: 100%;
  }

  .header-nav ul li a,
  .header-nav ul li button.nav-button {
    display: block;
    padding: 1rem;
    width: 100%;
  }

  /* Show the Ham component on small screens */
  .ham-container { /* Target the Ham component's outer container */
    display: flex; /* Override display: none from Ham.css for small screens */
  }
}
```

* * *

### **Testing and Refinement**

1.  **Ensure your React development server is running:**
    - Navigate to your React project directory.
    - Run `npm run dev`.
2.  **Open your browser** to `http://localhost:YourAppPort`.
3.  **Resize your browser window:**
    - **Large Screen:** Verify the full navigation bar is visible. The `<Ham />` component (hamburger icon) should be invisible.
    - **Small Screen (below your breakpoint):** The navigation links should disappear, and the hamburger icon (from `<Ham />`) should appear.
    - **Click the Hamburger Icon:** The navigation links should then appear, stacked vertically, usually below the header. The hamburger icon itself should animate into an "X" shape (due to `Ham.css`). Clicking it again should hide them and revert the icon.
    - **Click a Navigation Link:** Verify the menu closes after clicking a link.