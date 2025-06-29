import React from 'react'
import './Home.css'

const video = 'df324611-afe7-4da8-8915-0025b4113d58.mp4'

function Home() {
  return (
    <div className='wrapper home_wrapper'>
        <h2>Welcome to the wonderfull world of M + S Wade</h2>
        <div className="Home_video">
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
    </div>
  )
}

export default Home
