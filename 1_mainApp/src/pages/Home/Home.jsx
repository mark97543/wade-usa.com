import React from 'react'
import './Home.css'

const video = 'bd361151-bb44-46d2-8cfd-5e60a33cf146.mp4'

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
                <source src={`https://api.wade-usa.com/assets/${video}`} type="video/mp4" />
                Your browser does not support the video tag. Please update your browser.
            </video>
        </div>
    </div>
  )
}

export default Home
