// /home/mark/Documents/wade-usa.com/client/src/components/header/header.jsx

import React, {useEffect, useState} from "react";
import './header.css'
import {useAuth} from '../../context/AuthContext.jsx'
import { useNavigate } from "react-router-dom";

const Header =()=>{

    const {isAuthenticated, isLoading, user, logout} = useAuth();
    const navigate = useNavigate()
    // Handle the loading state first
    if(isLoading){
        return <p>Checking Authentication ...</p>
    }

    const goToLogin = ()=>{
        navigate('/login')
    }

    const handleLogout = () => {
        //console.log("Header: handleLogout called (will only call context logout)...");
        logout(); // Call context logout - it handles state/storage
    };

    //#region This use effect will get the current theme
    // const [hideDark, setHideDark]=useState()
    // const [hideLight, setHideLight]=useState()
    // const [currentTheme, setCurrentTheme] = useState('dark');
    // useEffect(()=>{
    //     const htmlElement = document.documentElement; // Get the root <html> element
    //     if (htmlElement) {
    //     setCurrentTheme(htmlElement.dataset.bsTheme);
    //     //console.log("Current page theme:", htmlElement.dataset.bsTheme); // Optional: Log the theme
    //     }
    //     if(currentTheme==="light"){
    //         setHideDark(false)
    //         setHideLight(true)
    //     }else{
    //         setHideDark(true)
    //         setHideLight(false)
    //     }
    // },[currentTheme]);

    // const handleThemeChange = (newTheme) => {
    //     const htmlElement = document.documentElement;
    //     if (htmlElement) {
    //       htmlElement.dataset.bsTheme = newTheme;
    //       setCurrentTheme(newTheme); // Update the state to reflect the change in the component
    //     }
    // };
    //#endregion


    return(
        
        <nav className="navbar navbar-expand-lg bg-primary" id="app-header" data-bs-theme="dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">M&S Wade</a>
  
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                


                {/* Main Linkd */}
                {isAuthenticated ? (
                    <div className="collapse navbar-collapse" id="navbarColor01">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/dashboard">Dashboard</a>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Calculators</a>
                                <div className="dropdown-menu">
                                    <a className="dropdown-item" href="/unitconverter">Unit Converter</a>
                                    <a className="dropdown-item" href="/currencyconverter">Currency Converter</a>
                                </div>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Blogs</a>
                                <div className="dropdown-menu">
                                    <a className="dropdown-item" href="/movingtousa">Moving to USA</a>
                                    <a className="dropdown-item" href="/blog">Travel Blog</a>
                                </div>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Games</a>
                                <div className="dropdown-menu">
                                    <a className="dropdown-item" href="/games/war">War</a>
                                </div>
                            </li>

                        </ul>
                        <button type="button" className="btn btn-light" onClick={handleLogout}>Logout</button>
                    </div>
                ):(
                <div className="collapse navbar-collapse log-in" id="navbarColor01">
                    <ul className="navbar-nav me-auto">
                         <li className="nav-item">
                            <a className="nav-link active" href="/blog">Travel Blog</a>
                         </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Games</a>
                            <div className="dropdown-menu">
                                <a className="dropdown-item" href="/games/war">War</a>
                            </div>
                        </li>
                    </ul>

                </div>)}

                
            </div>
            <div className="collapse navbar-collapse log-in" id="navbarColor01">
                {/* <form className="d-flex">
                        <button type="button" className="btn btn-light" hidden={hideLight} onClick={()=>handleThemeChange("light")}>Light</button>
                        <button type="button" className="btn btn-dark" hidden={hideDark} onClick={()=>handleThemeChange("dark")}>Dark</button>
                </form> */}
                {isAuthenticated ? (
                    <></>
                ):(
                    <button type="button" className="btn btn-light" onClick={goToLogin}> Login</button>
                )}
                
            </div>
        </nav>
        
    )
}

export default Header;

