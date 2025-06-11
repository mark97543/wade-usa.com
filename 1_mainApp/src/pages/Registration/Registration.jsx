import React, { useState } from 'react';
import { useAuth } from '@contexts/AuthContext.jsx'; // Importing AuthContext to use register function
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import './Registration.css'; // Ensure this CSS file exists and is imported

//Iitial setup for Directus API URL
const DIRECTUS_API_URL = import.meta.env.VITE_DIRECTUS_API_URL;
const publicApi = axios.create({
    baseURL: DIRECTUS_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const video = '341d19bc-269c-42db-ba3b-1f80f3256cd7.mp4'


function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, isLoggedIn } = useAuth(); // Get register function from context
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState(null);


    // Redirect if already logged in
    if (isLoggedIn) {
        navigate('/dock'); // Or wherever your dashboard page is
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        setLoading(true);

        if (password !== confirmPassword) {
            setLocalError('Passwords do not match.');
            setLoading(false);
            return;
        }

        try{
            //Send Registration Request to Directus API
            const response = await publicApi.post('/users',{
                email: email,
                password: password,
                role: 'e4af064a-599f-49e9-b591-b7fe4297061b', 
   
            })

            if(response.status === 204) {
                // Registration successful, now log in the user
                setSuccessMessage('Registration successful! You can now log in.');
                setTimeout(() => {
                    navigate('/pending'); // Redirect to login page after successful registration
                }, 2000); // Redirect after 2 seconds
            }else{
                setLocalError('Registration failed. Please try again.');
            }
        }catch (err) {
            console.error('Registration error:', err.response ? err.response.data : err.message);
            if (err.response && err.response.data && err.response.data.errors) {
                // Directus API errors are typically nested under .errors
                setLocalError(err.response.data.errors[0]?.message || 'An unknown error occurred during registration.');
            } else {
                setLocalError('Network Error or unexpected issue during registration.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='wrapper register_wrapper'>
            <div className="reg_video">
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
            <h2>Register for an Account</h2>
            <form className='form_box' onSubmit={handleSubmit}>
                <label htmlFor='register_email'>Email</label>
                <input
                    id='register_email'
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                />

                <label htmlFor='register_password'>Password</label>
                <input
                    id='register_password'
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                />

                <label htmlFor='confirm_password'>Confirm Password</label>
                <input
                    id='confirm_password'
                    type='password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                />

                {localError && <p className="error-message">{localError}</p>}
                {successMessage && <p className="error-message">{successMessage}</p>}

                <button type='submit' disabled={loading} className='register_button_page'>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
}

export default Register;