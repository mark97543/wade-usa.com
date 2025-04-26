// /home/mark/Documents/wade-usa.com/client/src/components/header/header.jsx

import React, {useEffect, useState} from "react";
import './header.css'


const Header =()=>{

    //#region This use effect will get the current theme
    const [hideDark, setHideDark]=useState()
    const [hideLight, setHideLight]=useState()
    const [currentTheme, setCurrentTheme] = useState('dark');
    useEffect(()=>{
        const htmlElement = document.documentElement; // Get the root <html> element
        if (htmlElement) {
        setCurrentTheme(htmlElement.dataset.bsTheme);
        console.log("Current page theme:", htmlElement.dataset.bsTheme); // Optional: Log the theme
        }
        if(currentTheme==="light"){
            setHideDark(false)
            setHideLight(true)
        }else{
            setHideDark(true)
            setHideLight(false)
        }
    },[currentTheme]);

    const handleThemeChange = (newTheme) => {
        const htmlElement = document.documentElement;
        if (htmlElement) {
          htmlElement.dataset.bsTheme = newTheme;
          setCurrentTheme(newTheme); // Update the state to reflect the change in the component
        }
    };



    //#endregion

    return(
        
        <nav className="navbar navbar-expand-lg bg-primary" id="app-header" data-bs-theme="dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Navbar</a>
            </div>
            <form className="d-flex">
                <button type="button" class="btn btn-light" hidden={hideLight} onClick={()=>handleThemeChange("light")}>Light</button>
                <button type="button" class="btn btn-dark" hidden={hideDark} onClick={()=>handleThemeChange("dark")}>Dark</button>

            </form>
        </nav>
        
    )
}

export default Header;

