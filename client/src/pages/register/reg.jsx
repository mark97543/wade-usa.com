// /client/src/pages/register/reg.jsx

import React, {useState} from "react";
import './reg.css'
import { useNavigate } from "react-router-dom";

//Use the envirenmental variable provided by vite
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Will be 'http://localhost:5000/api' in dev, '/api' in prod
const API_REGISTER_URL = `${API_BASE_URL}/auth/register`; // The '/auth/login' part is consistent

const Register = ()=>{

    const [email, setEmail]=useState('')
    const [password, setPassword]=useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e)=>{
        e.preventDefault() //Just to prevent refresh to see if works
        console.log('Email Sent to Server to Registration: ',email)
        

        try{
            const response = await fetch(API_REGISTER_URL,{
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',// Tell backend we're sending JSON
                },
                body: JSON.stringify({email, password}),
            });

            //Check if request was successful
            if(response.ok){
                const data = await response.json()
                console.log('Registration Successfull: ', data)
                navigate('/register/success')
            }else{
                //Handle Errors
                const errorData = await response.json()
                console.error('Registration Failed: ', response.status, errorData)
                setError(errorData.message || `Registration failed with status: ${response.status}`); // Show error message from backend or a generic one

            }
        }catch (err) {
            // Handle network errors or other issues with the fetch call itself
            console.error('Network or other error:', err);
            setError('Registration failed due to a network error. Please try again.');
        } finally {
            //setIsLoading(false); // Reset loading state regardless of success/error
        }
    }

    return(
        <div className="Registration-Box">
            <div className="Reg-intro">
                <h1>Welcome</h1>
                <p>To accept your invite fill the form below and wait for yoru registration to be accepted</p>
            </div>

            <div className="Reg-video">
                <video
                    width="100%" // Example: Make it responsive width
                    preload="metadata" // Helps load dimensions/duration quickly
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src='https://01-spaces.sfo3.cdn.digitaloceanspaces.com/registration/PD-DMV.mp4' type="video/mp4" />
                    Your browser does not support the video tag. Please update your browser.
                </video>
            </div>
            <div className="Reg-Form-Div">
                <form className="Reg-form" onSubmit={(e)=>handleSubmit(e)}>
                    <label className="col-form-label mt-4" htmlFor="username">Email</label>
                    <input type="email" className="form-control" placeholder="Email" id="username" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    <label htmlFor="exampleInputPassword1" className="form-label mt-4">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" required value={password} onChange={(e)=>setPassword(e.target.value)} autoComplete="off" />
                    <button type="submit" className="btn btn-success">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default Register