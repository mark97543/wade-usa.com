import React from 'react'
import './Goodbye.css'

const video = '3682d4ad-5159-4345-a812-403e6ed03453.mp4'

function Goodbye() {
  return (
    <div className='goodbye_wrapper'>
        <h2>Goodbye</h2>
        <div className="goodbye_video">
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

export default Goodbye
