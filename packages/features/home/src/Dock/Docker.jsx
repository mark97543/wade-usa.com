import React from 'react'
import './Docker.css'

const video = 'e5d48f02-9037-41c1-8320-2067fcfab74b.mp4';

function Docker() {
  return (
    <div className='docker_Wrapper'>
        <h2>This Page is under construction</h2>
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


export default Docker

//TODO: Need to Complete Docker