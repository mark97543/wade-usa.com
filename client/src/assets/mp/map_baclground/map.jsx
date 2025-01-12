import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';


const MapComponent = () => {

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;


  return(
    <div style={{ height: '100vh', width: '100%' }}> {/* Set the size of the map */}
        <LoadScript googleMapsApiKey={AIzaSyAQMwYG50i6xTEuBgARfrdzm4TRei99rik} /> {/* Load the Google Maps API */}
        <div style={{position: 'absolute', top: '0', left: '0', zIndex:'1' }}>
            {/* Add any components that should appear on top of the map */}
        </div>
    </div>
  );
}

export default MapComponent;