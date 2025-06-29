// /client/src/pages/404 page/404NotFound.jsx

import React from "react";
import './404NotFound.css'

const video = '32299d8b-469e-4a87-8a62-f1105324e209.mp4'; 

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
                       <source src={`https://wade-usa-assets.sfo3.digitaloceanspaces.com/${video}`} type="video/mp4" /> 
                        Your browser does not support the video tag. Please update your browser.
                    </video>
            </div>
        
        </>
    )


}

export default Page404;