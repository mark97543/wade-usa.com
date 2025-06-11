import React from 'react'
import './LoginButtons.css'; // Importing CSS for styling
import { useAuth } from '@contexts/AuthContext'; // Importing AuthContext to use authentication state
import { useNavigate } from 'react-router-dom'; // Import useNavigate




function LoginButtons() {
    const { isAuthenticated, logout, user } = useAuth(); // Get authentication state from AuthContext
    const navigate = useNavigate(); // Initialize useNavigate

    const handleLoginButtonClick = () => {
        // Logic for handling login button click can be added here
        // For now, we can redirect to the login page
        navigate('/login'); // Redirect to the login page
    }

  const handleLogoutButtonClick = () => {
    logout(); // Call the logout function from AuthContext
    navigate('/goodbye'); // Redirect to the goodbye page after logout
  }

  return (
    <div className='login_buttons_container'>
        {isAuthenticated ? (
          <>
            <p className='header_welcome_message'>Welcome, {user.first_name}!</p>
            <button className='logout_button' onClick={handleLogoutButtonClick}>Logout</button>
          </>
        ) : (
          <button className='login_button' onClick={handleLoginButtonClick}>Login</button>
        )}
    </div>
  )
}

export default LoginButtons
