import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';


const MapComponent = () => {
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState(null);// Use useState to store the Google Maps API key. Initially set to null.

  // useEffect hook to handle loading the API key when the component mounts.
  useEffect(() => {
    console.log('Checking for API key...'); // Log a message to the console to show the effect is running.
    const interval = setInterval(() => { // Set up an interval to poll for the API key.
        if (window.env && window.env.googleMapsApiKey) {// Check if window.env and window.env.googleMapsApiKey are defined.
            setGoogleMapsApiKey(window.env.googleMapsApiKey);// If the API key is available, set it in the component's state.
            clearInterval(interval); // Clear the interval to stop polling.
            console.log('API key is available:', window.env.googleMapsApiKey);
        }
    }, 200);// Check every 200ms
    return () => clearInterval(interval);  // Clean up the interval when the component unmounts to avoid memory leaks.
}, []);// The empty dependency array means this effect runs only once on mount.

  if (!googleMapsApiKey) {  // Conditionally render the map only when the API key is available.
    return <div>Loading map...</div>; 
  }

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
        <GoogleMap
          mapContainerStyle={{ height: '100vh', width: '100%' }} // Make map full viewport height
          center={{ lat: 37.7749, lng: -122.4194 }} // Set default center
          zoom={10} // Set default zoom
        />
    </LoadScript>
  )

};

export default MapComponent; // Only export once

