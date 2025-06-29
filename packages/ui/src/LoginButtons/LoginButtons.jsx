import React from 'react';
import './LoginButtons.css'; 
import {useNavigate} from 'react-router-dom'
import { useAuth } from '@wade-usa/auth';


function LoginButtons() {
    const navigate = useNavigate()
    const { isLoggedIn, logout } = useAuth(); // Use isLoggedIn for a clear state check


    const loginClick = ()=>{
        navigate('/login')
    }

    const logoutClick = () => {
        logout(); // This will also handle navigation to /goodbye
    };

    return (
        <div className="login_buttons_container">
            {isLoggedIn ? (
                <>
                    <button className="logout_button" onClick={logoutClick}>
                        Logout
                    </button>
                </>
            ) : (
                <>
                    <button className="login_button" onClick={loginClick}>
                        Login
                    </button>
                </>
            )}
        </div>
    );
}

export default LoginButtons;