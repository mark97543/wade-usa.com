import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';


const MapComponent = () => {

  // Access the API key from the window object
  const googleMapsApiKey = window.env.googleMapsApiKey; 


  return(
    <div style={{ height: '100vh', width: '100%' }}> {/* Set the size of the map */}
        <LoadScript googleMapsApiKey={googleMapsApiKey} /> {/* Load the Google Maps API */}
        <div style={{position: 'absolute', top: '0', left: '0', zIndex:'1' }}>
            {/* Add any components that should appear on top of the map */}
        </div>
        
    </div>
  );
}

export default MapComponent;