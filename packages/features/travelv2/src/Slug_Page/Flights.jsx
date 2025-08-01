import React from 'react'
import {formatDirectusTimeOnly, formatDirectusDateToMMDDYY} from '@wade-usa/auth'


/**
 * @component Flights
 * @description Renders a list of flights for a specific trip.
 * This component takes an array of flight objects and displays them in a structured layout.
 *
 * @param {object} props - The component props.
 * @param {Array<object>} props.flights - An array of flight objects to be displayed. Each object should contain details like airline, flight number, start/end times, etc.
 * @returns {React.ReactElement} The rendered list of flights.
 */
function Flights({ flights }) {
    // console.log(flights) // Good for debugging the flights data
  return (
    <div className='slug_flights_container'>
        <h2>Flights</h2>
        {/* Map over the flights array to render each flight individually */}
        {flights.map((flight, index) => (
            <div key={index} className='slug_flight'>
                {/* Box 0: Main flight header with airline, flight number, and date */}
                <div className='slug_flight_box0'>
                    <h3>{`✈️ Flight ${index +1} - ${flight.airline} ( ${flight.flight} ) - ${formatDirectusDateToMMDDYY(flight.start)}`} </h3>
                </div>
                {/* Box 1: Detailed flight information like airline, flight number, and duration */}
                <div className='slug_flight_box1'>
                    <h4><b>Airline:</b> {flight.airline}</h4>
                    <h4><b>Flight:</b> {flight.flight}</h4>
                    <h4><b>Duration:</b> {flight.duration_hours}h{flight.duration_minutes}m</h4>
                </div>
                {/* Box 2: Airport codes for departure and arrival */}
                <div className='slug_flight_box2'>
                    <h2>{flight.from_ap_code}</h2>
                    <h2>►</h2>
                    <h2>{flight.to_ap_code}</h2>
                </div>
                {/* Box 3: Departure city, time, and date */}
                <div className='slug_flight_box3'>
                    <h5>{flight.from}</h5>
                    <h3>{formatDirectusTimeOnly(flight.start)}</h3>
                    <h5>{formatDirectusDateToMMDDYY(flight.start)}</h5>
                </div>
                {/* Box 4: Arrival city, time, and date */}
                <div className='slug_flight_box4'>
                    <h5>{flight.to}</h5>
                    <h3>{formatDirectusTimeOnly(flight.end)}</h3>
                    <h5>{formatDirectusDateToMMDDYY(flight.end)}</h5>
                </div>
                {/* Box 5: Additional notes for the flight */}
                <div className='slug_flight_box5'>
                    <h5><i>Notes: {flight.note}</i></h5>
                </div>
            </div>
        ))}
    </div>
  )
}

export default Flights