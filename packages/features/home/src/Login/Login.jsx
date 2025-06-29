// 1_client/src/pages/Login/Login.jsx

import React, { useState, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import {useAuth} from '@wade-usa/auth'

// Removed testDirectusClient as it was for the temporary test
// The main directus client is provided via AuthContext
const video = '47cdaf48-bd64-4e40-a283-47bfbaa858ec.mp4'


function Login() {
    const [email, setEmail]=useState('')
    const [password, setPassword]=useState('')
    const [loading, setLoading]=useState(false)
    const [error, setError] = useState(null);
    const {login} = useAuth()

    const [authErro, setAuthError] =useState(null)

    const navigate = useNavigate(); // Using useNavigate for programmatic navigation

    const handleSubmit = async (event) =>{
        event.preventDefault();
        setLoading(true)
        setError(null)

        console.log('LOGIN PAGE: Attempting to log in with:', { email, password }); // <-- ADD THIS


        try{
            await login(email, password);
            navigate('/docker')
        }catch (err){
            console.error('Login failed:', error); // Your existing log
            console.log('FULL LOGIN ERROR OBJECT:', error); // <-- ADD THIS
            setAuthError('Invalid email or password.');
            throw new Error('Invalid email or password.');
        }finally{
            setLoading(false)
        }
    }



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

        <form className='form_box' onSubmit={handleSubmit}>
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