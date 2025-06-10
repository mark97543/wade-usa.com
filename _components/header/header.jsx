import React from 'react';
import './header.css'; // <-- Added CSS import here!
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '@contexts/AuthContext'; // Importing AuthContext to use authentication state



const appName = import.meta.env.VITE_APP_NAME;//Read the environment variable to know which app is running

const Header = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const { isAuthenticated, logout } = useAuth(); // Get authentication state from AuthContext

  const handleLoginButtonClick = () => {
    // Logic for handling login button click can be added here
    // For now, we can redirect to the login page
    navigate('/login'); // Redirect to the login page
  }

  const handleLogoutButtonClick = () => {
    logout(); // Call the logout function from AuthContext
    navigate('/login'); // Redirect to the login page after logout
  }

  //console.log("Is Authenticated:", isAuthenticated); // Debugging log to check authentication state


  return (
    <header className='header_container'>
      <div className='header_logo'>
           <a href='/'>M+S </a> {/* TODO: Logo link, can be updated to point to the homepage or docker page when logged in. */}
      </div>

      <div className='header_right'>
        {isAuthenticated ? (
          <button className='logout_button' onClick={handleLogoutButtonClick}>Logout</button>
        ) : (
          <button className='login_button' onClick={handleLoginButtonClick}>Login</button>
        )}
      </div>

    </header>
  );
};

export default Header;


