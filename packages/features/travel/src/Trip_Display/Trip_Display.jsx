import React, {useState, useEffect} from 'react'
import './Trip_Display.css'
import { useActionData, useParams } from 'react-router-dom'; // Hook to access URL parameters
import {fetchTripBySlug} from '@wade-usa/auth'
import {formatDirectusDateToMMDDYY, formatDirectusDateTime} from '@wade-usa/auth'
import Flights from './Components/Flights';
import Hotels from './Components/Hotels';
import RentalCars from './Components/RentalCars';
import Events from './Components/Events';
import Days from './Components/Days';



function Trip_Display() {
    const { link } = useParams(); // Get the 'link' (which is actually the slug value) from the URL parameter
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [flights, setFlights] = useState()
    const [hotels, setHotels]= useState()
    const [rentalCars, setRentalCars]=useState()
    const [events, setEvents]=useState()
    const [days, setDays]=useState()

    useEffect(() => {
        const loadTrip = async () => {
            try {
                setLoading(true); // Start loading
                const tripData = await fetchTripBySlug(link);

                if (tripData) {
                    setTrip(tripData);
                    if (tripData.flights){
                        setFlights(tripData.flights.sort((a, b) => a.depart.localeCompare(b.depart))); //Sorts Flights andloads into state for mapping
                    }
                    if(tripData.hotels){
                        setHotels(tripData.hotels.sort((a,b) => a.checkin.localeCompare(b.checkin)));
                    }
                    if(tripData.rental_cars){
                        setRentalCars(tripData.rental_cars.sort((a,b) => a.pickup_time.localeCompare(b.pickup_time)))
                    }
                    if(tripData.events){
                        setEvents(tripData.events.sort((a,b) => a.start_time.localeCompare(b.start_time)))
                    }
                    if(tripData.trip_day_detail){
                        setDays(tripData.trip_day_detail)
                    }
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
    

    //console.log(days)
    return (
        <div className='trip_display_root'>
            <div className='trip_display_header_block1'>
                <img className='trip_display_header_img' src={`https://api.wade-usa.com/assets/${trip.header}?key=banner-5-1`}/>
                <h1>{trip.trip_title}</h1>
                <h4>{`${formatDirectusDateToMMDDYY(trip.start_date)} through ${formatDirectusDateToMMDDYY(trip.end_date)}`}</h4>
                <h4><i>{`Created: ${formatDirectusDateToMMDDYY(trip.date_created)}, Updated: ${formatDirectusDateToMMDDYY(trip.date_updated)}`}</i></h4>
                <div dangerouslySetInnerHTML={{ __html: trip.long_summary }}/>
            </div>

            <hr></hr>
            {days ? (
                <div>
                    <h1 className='trip_plans_title'>Trip Plans</h1>
                    {days.map((day, index)=>{
                        return(
                        <div key={index} className='trip_plans_functions'>
                            <Days day={day}/>
                        </div>
                    )})}
                </div>
            ):''}

            <hr></hr>
            <h1 className='trip_plans_title'>Itinerary</h1>
            {flights ? (
                <Flights flights={flights}/>
            ): ''}
            {hotels ? (
                <Hotels hotels={hotels}/>
            ):''}
            {rentalCars ? (
                <RentalCars rentalCars={rentalCars}/>
            ):''}
            {/* {events ? (
                <Events events={events} />
            ): ''} */}



        </div>

    )
}




export default Trip_Display