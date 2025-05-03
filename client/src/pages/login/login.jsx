// /client/src/pages/login/login.jsx

import React, {useState} from "react";
import './login.css'
import {useAuth} from '../../context/AuthContext.jsx'
import { useNavigate } from "react-router-dom";


//Use the envirenmental variable provided by vite
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Will be 'http://localhost:5000/api' in dev, '/api' in prod
const API_LOGIN_URL = `${API_BASE_URL}/auth/login`; // The '/auth/login' part is consistent


const Login = ()=>{

    const [email, setEmail]=useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage]=useState('')
    const [isLoading, setIsLoading]= useState(false)
    const navigate = useNavigate();

    const {login} =useAuth();

    const passwordChange = (e) =>{
        setPassword(e.target.value)
        setMessage("") 
    }

    const userNameChange = (e)=>{
        setEmail(e.target.value)
        setMessage("")
    }

    //handeler for the submit button
    const handleSubmit = async (e)=>{
        e.preventDefault();

        //CLEARE MESSEGES AND SET LOADONG
        setMessage("")
        setIsLoading(true)

        //Bsic Client Side Validations
        if(!email || !password){
            setMessage('Email and Password are required')
            setIsLoading(false)
            return
        }

        //Prepare data to be sent
        const loginData={
            email: email,
            password:password
        }

        try{
            //Send the POST request
            const response = await fetch(API_LOGIN_URL, {
                method:'POST',
                headers:{
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(loginData)
            })

            const data = await response.json() //parse the JSON response from the backend
        
            setIsLoading(false)

            //check if the response status is in the 2xx range(successfull)
            if(response.ok){
                //successful login
                
                setMessage(`Success: ${data.message}`)//display success message
                console.log(`Login Successful: `, data.user)
                console.log(`Recived Token: `, data.token)


                login(data.token, data.user); // Call the login function provided by useAuth()


                // --- TODO: Redirect after successful login ---
                // Use react-router-dom's navigation to redirect the user
                navigate('/dashboard');

            }else{
                //Handle Error responses
                //display error sent from backend
                setMessage(`Error: ${data.message || 'Login failed'}`)
                console.error('Login Failed: ', response.status, data.message)
            }
        
        }catch(error){
            console.error('Network or unexpected error during login: ', error)
            setIsLoading(false)
            setMessage('An unexpected error occured. please try again')
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
                <form className="login-form" onSubmit={handleSubmit}>
                    <h3>Sign In</h3>
                    <label className="col-form-label mt-4" htmlFor="username">Email</label>
                    <input type="email" className="form-control" placeholder="User Name" id="username" value={email} onChange={(e)=>{userNameChange(e)}}/>
                    <label htmlFor="exampleInputPassword1" className="form-label mt-4">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" autoComplete="off" value={password} onChange={(e)=>{passwordChange(e)}}/>
                    <button type="submit" className="btn btn-success" disabled={isLoading}>{isLoading ? 'Signing In...' : 'Sign In'}</button>
                </form>
            </div> 
            <div className="login-disclaimer">
                <h6 >*This video was AI generated</h6>
            </div>
            <div className="login-message">
                {message && (
                        <p className={`mt-3 login-message-p ${message.startsWith('Error:') ? 'text-danger' : 'text-success'}`}>
                            {message}
                        </p>
                )}
            </div>
            
        </>
    )
}

export default Login;