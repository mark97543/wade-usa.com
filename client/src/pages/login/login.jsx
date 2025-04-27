// /client/src/pages/login/login.jsx

import React from "react";
import './login.css'


const Login = ()=>{
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
                    <input type="text" className="form-control" placeholder="User Name" id="username"/>
                    <label htmlFor="exampleInputPassword1" className="form-label mt-4">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" autoComplete="off"/>
                    <button type="button" className="btn btn-success">Sign In</button>
                </div>
            </div> 
            <div className="login-disclaimer">
                <h6 >*This video was AI generated</h6>
            </div>
            
        </>
    )
}

export default Login;