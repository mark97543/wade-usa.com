import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@wade-usa/auth'; // Import our existing useAuth hook
import './Registration.css';

const video = '15fcc1bf-6434-4410-9bdd-d426b2265dc9.mp4';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // We get the error state and loading state directly from our AuthContext
    const { register, authError, loading } = useAuth(); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // We can keep this local check for immediate feedback
        if (password !== confirmPassword) {
            // This is a good place to have a local error state if you want
            // but for now, we can alert the user or handle it simply.
            alert('Passwords do not match.');
            return;
        }

        try {
            // Use the register function from our AuthContext
            const success = await register(email, password);
            if (success) {
                // The register function in the context now handles login,
                // so we can directly navigate to the protected page.
                navigate('/docker');
            }
        } catch (err) {
            // The error is already being managed by the authError state
            // in the context, so we just need to log it for debugging.
            console.error("Registration failed on component level:", err);
        }
    };

    return (
        <div className='wrapper register_wrapper'>
            <div className="reg_video">
                <video
                    width="100%"
                    preload="metadata"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                <source src={`https://wade-usa-assets.sfo3.digitaloceanspaces.com/${video}`} type="video/mp4" />
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

                {/* Display the error from our central AuthContext */}
                {authError && <p className="error-message">{authError}</p>}

                <button type='submit' disabled={loading} className='register_button_page'>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
}

export default Register;