import React from 'react'
import './Goodbye.css'

const video = '6cbf74c9-41a2-4cc0-9d87-eaaacbb4e5d2.mp4'

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
