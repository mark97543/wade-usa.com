// 1_client/src/pages/Login/Login.jsx

import React, { useState, useEffect } from 'react';
import './Login.css';
import { useAuth } from '@contexts/AuthContext'; // Importing AuthContext to use login function
import { useNavigate } from 'react-router-dom';

// Removed testDirectusClient as it was for the temporary test
// The main directus client is provided via AuthContext
const video = '34dbe784-e111-4c5a-af46-a9fc951ad1a1.mp4'


function Login() {
    const [email, setEmail]=useState('')
    const [password, setPassword]=useState('')
    const [loading, setLoading]=useState(false)
    const [error, setError] = useState(null);

    const { login } = useAuth(); // use the login function from AuthContext
    const navigate = useNavigate(); // Using useNavigate for programmatic navigation


    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null); // Reset error state
        
        // Simulate login for now
        //console.log("Attempting to log in with:", email, password);
        const success = await login(email, password); 
        if (success) {
            //console.log("Simulated login successful!");
            navigate('/docker'); // <--Redirect to a protected page on success
        } else {
            setError('Invalid email or password'); // Set error message for display
            //console.log("Simulated login failed!");
            setLoading(false);
        }
    };


  return (
    <div className='login_page_wrapper'>
        <div className="login_video">
            <video
                width="100%" // Example: Make it responsive width
                preload="metadata" // Helps load dimensions/duration quickly
                autoPlay
                loop
                muted
                playsInline
            >
                <source src={`https://api.wade-usa.com/assets/${video}`} type="video/mp4" />
                Your browser does not support the video tag. Please update your browser.
            </video>
        </div>

        <form className='form_box' onSubmit={handleSubmit}>
            <h3>Welcome Back</h3>
            <p>{error}</p> {/*TODO: Format This Display error message if any */}
            <label htmlFor='login_input'>Email</label>
            <input id='login_input' type='email' onChange={(e) => setEmail(e.target.value)} value={email} required disabled={loading}></input>
            <label htmlFor='login_password'>Password</label>
            <input type='password' id='login_password' onChange={(e) => setPassword(e.target.value)} value={password} required disabled={loading}></input>
            <button type='submit' disabled={loading} className='login_button_page' >{loading ? 'Logging In...' : 'Login'}</button>
        </form>

        <div className='login_Register'>
            <a href='/register'>Don't have an account? Register here</a>
        </div>

    </div>
  )
}

export default Login