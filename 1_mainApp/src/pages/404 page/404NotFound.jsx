// /client/src/pages/404 page/404NotFound.jsx

import React from "react";
import './404NotFound.css'

const video = '14f68d75-714c-4f8d-9e43-e56fc1c7b4ba.mp4'; 

const Page404 = ()=>{

    return(
        <>
            <div className="error-text-404">
                <h1>Error: 404 Page not found</h1>
            </div>
            <div className="P404-video">
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
        
        </>
    )


}

export default Page404;