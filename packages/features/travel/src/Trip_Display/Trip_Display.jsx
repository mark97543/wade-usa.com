import React, {useState, useEffect} from 'react'
import './Trip_Display.css'
import { useParams } from 'react-router-dom'; // Hook to access URL parameters
import {fetchTripBySlug} from '@wade-usa/auth'
import {formatDirectusDateToMMDDYY} from '@wade-usa/auth'


function Trip_Display() {
    const { link } = useParams(); // Get the 'link' (which is actually the slug value) from the URL parameter
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadTrip = async () => {
            try {
                setLoading(true); // Start loading
                const tripData = await fetchTripBySlug(link);

                if (tripData) {
                setTrip(tripData);
                } else {
                setError('Trip not found.');
                }
            } catch (err) {
                setError('Failed to load trip data.');
                console.error(err);
            } finally {
                setLoading(false); // Stop loading, regardless of outcome
            }
        };
        loadTrip();
    }, [link]);

    //Render the component's UI based on the state
    if (loading) {
        return <div>Loading your adventure...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!trip) {
        // This case handles when loading is done but no trip was found
        return <div>No trip data available.</div>;
    }
    

    console.log(trip)
    return (
        <div className='trip_display_root'>
            <div className='trip_display_header_block1'>
                <img className='trip_display_header_img' src={`https://api.wade-usa.com/assets/${trip.header}?key=banner-5-1`}/>
                <h1>{trip.trip_title}</h1>
                <h4>{`${formatDirectusDateToMMDDYY(trip.start_date)} through ${formatDirectusDateToMMDDYY(trip.end_date)}`}</h4>
                <h4><i>{`Created: ${formatDirectusDateToMMDDYY(trip.date_created)}, Updated: ${formatDirectusDateToMMDDYY(trip.date_updated)}`}</i></h4>
            </div>
            
        </div>

    )
}




export default Trip_Display