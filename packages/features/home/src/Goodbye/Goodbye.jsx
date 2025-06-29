import React from 'react'
import './Goodbye.css'

const video = 'cb7baf6a-dbce-4521-95a3-6793bdf68858.mp4'

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
            <source src={`https://wade-usa-assets.sfo3.digitaloceanspaces.com/${video}`} type="video/mp4" />
            Your browser does not support the video tag. Please update your browser.
        </video>
    </div>
    </div>
  )
}

export default Goodbye
