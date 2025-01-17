import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'; // Import necessary components
import axios from 'axios';
import './map.css';


const MapComponent = () => {
  const [apiKey, setApiKey] = useState(null); // Store the API key
  const [error, setError] = useState(null);
  const mapRef = useRef(null);


  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await axios.get('/api/google-maps'); // Assuming your API returns the key
        setApiKey(response.data.apiKey); // Store the API key directly
      } catch (error) {
        console.error('Error fetching API key:', error);
        setError('Failed to load map. Please check your connection.');
      }
    };

    fetchApiKey();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!apiKey) {
    return <div>Loading map...</div>;
  }

  return (
    <div id='map_container'>
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={{ height: '100%', width: '100%' }}
          center={{ lat: 44.068203, lng: -114.742043 }}
          zoom={6}
        >
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapComponent;