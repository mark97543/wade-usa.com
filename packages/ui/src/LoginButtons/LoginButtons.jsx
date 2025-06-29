import React from 'react';
import './LoginButtons.css'; 
import {useNavigate} from 'react-router-dom'
//import { useAuth } from '@wade-usa/auth';


const appName = import.meta.env.VITE_APP_NAME;

function LoginButtons() {
    //const navigate = useNavigate()
    //const { user, logout } = useAuth();


    // const loginClick = ()=>{
    //     navigate('/login')
    // }

    return (
        <div className="login_buttons_container">
            {/* {user ? (
                <>
                <button className="login_button" onClick={logout}>
                    Logout
                </button>
                </>
            ):(
                <>
                    <button className="login_button" onClick={loginClick}>
                        Login
                    </button>
                </>
            )} */}
            <button className="login_button" >
                Login
            </button>
        </div>
    );
}

export default LoginButtons;