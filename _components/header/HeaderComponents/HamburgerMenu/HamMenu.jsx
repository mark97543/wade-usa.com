//This is THe Manburger Menu Item 

import React, {useState} from 'react'
import './HamMenu.css'; // Importing CSS for styling
import Ham from '../../../Ham Button/Ham';

function HamMenu() {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State to toggle mobile menu

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen); // Toggle the menu state
  }

  // Close menu when navigating
  const handleNavLinkClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  }

  return (
    <div className="header-ham-menu">
      <Ham className="header-ham-button" isMenuOpen={isMobileMenuOpen} onToggle={toggleMobileMenu} /> {/* Ham button component for the hamburger menu */}
      <nav className={`header-nav ${isMobileMenuOpen ? 'menu-open' : ''}`}>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      </nav>
    </div>
  )
}

export default HamMenu
