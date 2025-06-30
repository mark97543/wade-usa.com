import React from 'react'
import './Forbidden.css'

const video = '272d936f-a48a-4d89-af3d-310bbf825cae.mp4'


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
