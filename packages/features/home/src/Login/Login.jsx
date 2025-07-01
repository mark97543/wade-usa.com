// 1_client/src/pages/Login/Login.jsx

import React, { useState, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import {useAuth} from '@wade-usa/auth'

const video = '44a9adea-9372-4bba-990a-f5505f1902e4.mp4'


function Login() {
    const [email, setEmail]=useState('')
    const [password, setPassword]=useState('')
    const [loading, setLoading]=useState(false)
    const [error, setError] = useState(null);
    const {login} = useAuth()
    const navigate = useNavigate();


    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await login(email, password);
            navigate('/docker'); // Redirect to the protected docker page on success
        } catch (err) {
            // The error message is already set in the AuthContext
            // We can just re-throw it or set a local error state
            setError('Invalid email or password. Please try again.');
            console.error('Login Page Error:', err);
        } finally {
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
                <source src={`https://wade-usa-assets.sfo3.digitaloceanspaces.com/${video}`} type="video/mp4" />
                Your browser does not support the video tag. Please update your browser.
            </video>
        </div>

        <form className='form_box_login' onSubmit={handleSubmit}>
            <h3>Welcome Back</h3>
            <p>{error}</p> 
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