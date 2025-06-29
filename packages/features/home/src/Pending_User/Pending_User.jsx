import React from 'react'
import './Pending_User.css'

const video = '465c3d0c-5e6b-44ef-8e76-061560e06a87.mp4'


function Pending_User() {
  return (
    <div className='pending_wrapper'>
        <div className="login_video">
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
        <h3>Your Membership Has Not Been Autherized Yet</h3>
        <p>Contact The System Adminstrator If You Have Further Questions</p>
    </div>
  )
}

export default Pending_User
