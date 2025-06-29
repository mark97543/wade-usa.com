import React from 'react'
import './Forbidden.css'

const video = '9596fa3e-0191-43bc-8de0-254c1d2f3a40.mp4'


function Forbbiden() {
  return (
    <div className='forbidden_wrapper'>
        <div className="forbidden_video">
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
        <h3>Warning:</h3>
        <p>Your Delicate Mind Could not Possibly Fathom Whats On This Page</p>
    </div>
  )
}

export default Forbbiden
