import React from 'react';
import './header.css'; // <-- Added CSS import here!
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '@contexts/AuthContext'; // Importing AuthContext to use authentication state
import LoginButtons from './HeaderComponents/LoginButtons/LoginButtons';
import HamMenu from './HeaderComponents/HamburgerMenu/HamMenu.jsx'; // Importing the Hamburger Menu component



const appName = import.meta.env.VITE_APP_NAME;//Read the environment variable to know which app is running

const Header = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const { isAuthenticated, logout, user } = useAuth(); // Get authentication state from AuthContext



  return (
    <header className='header_container'>
      <div className='header_logo'>
           <a href='/'>M+S </a> {/* TODO: Logo link, can be updated to point to the homepage or docker page when logged in. */}
      </div>

      <div className='header_right'>
        <HamMenu /> {/* Hamburger menu component for mobile navigation */}
        <LoginButtons /> {/* Login buttons component for handling login/logout */}
      </div>

    </header>
  );
};

export default Header;


