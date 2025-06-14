import React from 'react'
import './LoginButtons.css'; // Importing CSS for styling
import { useAuth } from '@contexts/AuthContext'; // Importing AuthContext to use authentication state
import { useNavigate } from 'react-router-dom'; // Import useNavigate


const appName = import.meta.env.VITE_APP_NAME;//Read the environment variable to know which app is running

function LoginButtons() {
    
    const { isAuthenticated, logout, user } = useAuth(); // Get authentication state from AuthContext
    const navigate = useNavigate(); // Initialize useNavigate

    const handleLoginButtonClick = () => {
      if(appName==='home'){
        navigate('/login'); // Redirect to the login page
      }else{
        window.location.href='https://wade-usa.com/login'
      }

    }

    const handleLogoutButtonClick = () => {
      logout(); // Call the logout function from AuthContext
      if(appName==='home'){
        navigate('/goodbye'); // Redirect to the goodbye page after logout
      }else{
        window.location.href='https://wade-usa.com/goodbye'
      }

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
