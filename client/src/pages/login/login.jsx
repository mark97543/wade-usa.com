// /client/src/pages/login/login.jsx

import React, {useState} from "react";
import './login.css'


//Use the envirenmental variable provided by vite
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Will be 'http://localhost:5000/api' in dev, '/api' in prod
const API_LOGIN_URL = `${API_BASE_URL}/auth/login`; // The '/auth/login' part is consistent


const Login = ()=>{

    const [email, setEmail]=useState('')
    const [password, setPassword] = useState('')

    const passwordChange = (e) =>{
        setPassword(e.target.value)
    }

    const userNameChange = (e)=>{
        setEmail(e.target.value)
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        //Loading State
        const loginData={
            email: email,
            password:password
        }

        try{
            //use dynamic url
            const response = await fetch(API_LOGIN_URL, {
                method:'POST',
                headers:{
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(loginData)
            })
        }catch(error){
            console.log('Issue with login.jsx handleSubmit(): ', error)
        }
    }

    return(
        <>
            <div className="login-box">
                <div className="login-video">
                    <video
                        width="100%" // Example: Make it responsive width
                        preload="metadata" // Helps load dimensions/duration quickly
                        autoPlay
                        loop
                        muted
                        playsInline
                    >
                        <source src='https://01-spaces.sfo3.cdn.digitaloceanspaces.com/login/PDLogin2.mp4' type="video/mp4" />
                        Your browser does not support the video tag. Please update your browser.
                    </video>
                </div>
                <div className="login-form">
                    <h3>Sign In</h3>
                    <label className="col-form-label mt-4" htmlFor="username">User Name</label>
                    <input type="text" className="form-control" placeholder="User Name" id="username" onChange={(e)=>{userNameChange(e)}}/>
                    <label htmlFor="exampleInputPassword1" className="form-label mt-4">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" autoComplete="off" onChange={(e)=>{passwordChange(e)}}/>
                    <button type="button" className="btn btn-success" onClick={()=>handleSubmit()}>Sign In</button>
                </div>
            </div> 
            <div className="login-disclaimer">
                <h6 >*This video was AI generated</h6>
            </div>
            
        </>
    )
}

export default Login;