import React from 'react';
import './header.css'; // <-- Added CSS import here!
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '@contexts/AuthContext'; // Importing AuthContext to use authentication state
import Ham from './HeaderComponents/Ham Button/Ham';
import { getLogoLinkHref } from './HelperFunctions';



const appName = import.meta.env.VITE_APP_NAME;//Read the environment variable to know which app is running

const Header = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const { isAuthenticated, logout, user } = useAuth(); // Get authentication state from AuthContext

  const logoLink = getLogoLinkHref(isAuthenticated)


  return (
    <header className='header_container'>
      <div className='header_logo'>
        <a href={logoLink}>M+S</a>
      </div>

      <div className='header-ham-div'>
        <Ham /> {/* Hamburger menu component for mobile navigation */}
      </div>
      

 
    </header>
  );
};

export default Header;


