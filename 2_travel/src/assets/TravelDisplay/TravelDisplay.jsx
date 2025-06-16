import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Hook to access URL parameters
import './TravelDisplay.css'
import {formatDirectusDateToYYMMDD} from '@contexts/HelperFunctions.jsx'



/// Setting up Directus Connection
const DIRECTUS_BASE_URL = import.meta.env.VITE_DIRECTUS_API_URL; 

const directusApi = axios.create({
    baseURL: DIRECTUS_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // If your Directus uses HTTP-only cookies for refresh tokens
});

function TravelDisplay() {

    const { link } = useParams(); // Get the 'link' (which is actually the slug value) from the URL parameter
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("Slug from URL:", link); // <-- ADD THIS LINE
        const fetchTripBySlug = async () => {
        try {
            setLoading(true);
            setError(null);

            // --- HERE IS THE QUERY TO PULL DATA BASED ON THE SLUG ---
            const response = await directusApi.get('/items/travel_lvl1_list', { // Your collection name
            params: {
                filter: { link: { _eq: link } }, // <-- CRITICAL: Filter by the slug from the URL
                fields: 'id,trip_title,link, auther, date_created', // Request all fields
                limit: 1, // We only expect one result for a unique slug
            },
            });

            // Directus API responses for filtered lists are still in data.data[0] for the first item
            if (response.data.data && response.data.data.length > 0) {
                const fetchedTrip = response.data.data[0]; // Capture the item
                console.log("API Response - Fetched Trip Object:", fetchedTrip); // <-- ADD THIS LINE
                setTrip(response.data.data[0]); // Set the first (and only) item found
            } else {
                setError('Trip not found.'); // Handle case where slug doesn't match any trip
            }

        } catch (err) {
            console.error('Error fetching trip by slug:', err);
            setError('Failed to load trip details. Please try again.');
        } finally {
            setLoading(false);
        }
        };

        if (link) { // Only fetch if slug is available in the URL
        fetchTripBySlug();
        }
    }, [link]); // Re-run this effect if the slug in the URL changes


    

  return (
    <div className='trip_report_wrapper'>
        <h1>{loading ? <div>Loading ...</div> : trip.trip_title}</h1>
        <div className='trip_report_row2'>
           <p>{loading ? "" : `${trip.auther} on ${formatDirectusDateToYYMMDD(trip.date_created)}`}</p> 
        </div>
        


    </div>
  )
}

export default TravelDisplay
